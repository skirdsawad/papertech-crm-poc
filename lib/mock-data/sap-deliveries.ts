import { SAPDelivery, SAPDeliveryItem, SAPPOD, DeliveryTracking, GPSCoordinates } from '../types/sap'
import { DeliveryStatus } from '../types/enums'
import deliveriesData from './deliveries.json'
import { getOrderLines } from './sap-order-lines'

// Thailand GPS locations
const thailandLocations = {
  bangkok: { lat: 13.7563, lng: 100.5018 },
  central: { lat: 14.3532, lng: 100.5697 },
  north: { lat: 18.7883, lng: 98.9853 },
  northeast: { lat: 15.8700, lng: 100.9925 },
  east: { lat: 13.3611, lng: 100.9847 },
  south: { lat: 7.8804, lng: 98.3923 }
}

// Thai receiver names for POD
const receiverNames = [
  'นายสมชาย วัฒนา',
  'นางสาวกานต์ ศรีสุข',
  'นายประเสริฐ มั่นคง',
  'นางพิมพ์ใจ ใจดี'
]

function getDestinationByRoute(route: string): GPSCoordinates {
  if (route.includes('Central')) {
    return thailandLocations.central
  }

  if (route.includes('North')) {
    return thailandLocations.north
  }

  if (route.includes('Northeast')) {
    return thailandLocations.northeast
  }

  if (route.includes('East')) {
    return thailandLocations.east
  }

  if (route.includes('South')) {
    return thailandLocations.south
  }

  return thailandLocations.central
}

function generatePOD(status: string, deliveryIndex: number): SAPPOD | undefined {
  if (status !== DeliveryStatus.Delivered) {
    return undefined
  }

  return {
    signature_url: `/signatures/sig_${(deliveryIndex % 3) + 1}.png`,
    photo_url: `/pod-photos/pod_${(deliveryIndex % 5) + 1}.jpg`,
    received_by: receiverNames[deliveryIndex % receiverNames.length],
    received_date: new Date(),
    notes: deliveryIndex % 3 === 0 ? 'Delivered to warehouse' : undefined
  }
}

function generateTracking(status: string, route: string, deliveryIndex: number): DeliveryTracking {
  const origin = thailandLocations.bangkok
  const destination = getDestinationByRoute(route)

  let current_location: GPSCoordinates | undefined

  if (status === DeliveryStatus.InTransit) {
    const progress = 0.4 + ((deliveryIndex % 3) * 0.1)
    current_location = {
      lat: origin.lat + (destination.lat - origin.lat) * progress,
      lng: origin.lng + (destination.lng - origin.lng) * progress
    }
  }

  return {
    origin,
    destination,
    current_location,
    last_updated: status === DeliveryStatus.InTransit ? new Date() : undefined
  }
}

export const mockSAPDeliveries: SAPDelivery[] = deliveriesData.map((delivery, index) => {
  const orderLines = getOrderLines(delivery.order_no)
  const deliveryItems: SAPDeliveryItem[] = orderLines.map((line, idx) => ({
    line_no: (idx + 1) * 10,
    material_code: line.material_code,
    description: line.description,
    description_thai: line.description_thai,
    qty_ordered: line.qty,
    qty_shipped: delivery.status === DeliveryStatus.Delivered || delivery.status === DeliveryStatus.InTransit
      ? line.qty
      : 0,
    uom: line.uom
  }))

  return {
    ...delivery,
    planned_date: new Date(delivery.planned_date),
    actual_date: delivery.actual_date ? new Date(delivery.actual_date) : undefined,
    pod: generatePOD(delivery.status, index),
    items: deliveryItems,
    tracking: generateTracking(delivery.status, delivery.route, index)
  }
})

// Helper functions
export function getDeliveryByNo(deliveryNo: string): SAPDelivery | undefined {
  return mockSAPDeliveries.find(d => d.delivery_no === deliveryNo)
}

export function getDeliveriesByOrder(orderNo: string): SAPDelivery[] {
  return mockSAPDeliveries.filter(d => d.order_no === orderNo)
}

export function getDeliveriesByCustomer(customerNo: string): SAPDelivery[] {
  return mockSAPDeliveries.filter(d => d.customer_no === customerNo)
}

export function searchDeliveries(query: string): SAPDelivery[] {
  const lowerQuery = query.toLowerCase()

  return mockSAPDeliveries.filter(d =>
    d.delivery_no.toLowerCase().includes(lowerQuery) ||
    d.order_no.toLowerCase().includes(lowerQuery) ||
    d.customer_no.toLowerCase().includes(lowerQuery) ||
    d.customer_name.toLowerCase().includes(lowerQuery) ||
    d.tracking_no?.toLowerCase().includes(lowerQuery)
  )
}

export function getAllDeliveries(): SAPDelivery[] {
  return mockSAPDeliveries
}

export function getDeliveryStats() {
  const totalDeliveries = mockSAPDeliveries.length
  const delivered = mockSAPDeliveries.filter(d => d.status === DeliveryStatus.Delivered).length
  const inTransit = mockSAPDeliveries.filter(d => d.status === DeliveryStatus.InTransit).length
  const withPOD = mockSAPDeliveries.filter(d => d.pod_available).length

  return {
    totalDeliveries,
    delivered,
    inTransit,
    withPOD,
    podRate: totalDeliveries > 0 ? Math.round((withPOD / totalDeliveries) * 100) : 0
  }
}
