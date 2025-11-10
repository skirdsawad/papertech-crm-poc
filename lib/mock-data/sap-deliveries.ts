import { SAPDelivery, SAPDeliveryItem, SAPPOD, GPSCoordinates, DeliveryTracking } from '../types/sap'
import { DeliveryStatus } from '../types/enums'
import { mockSAPOrders } from './sap-orders'
import { getOrderLines } from './sap-order-lines'

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomEnum<T extends object>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][]

  return values[randomNumber(0, values.length - 1)]
}

function generateDeliveryNo(index: number): string {
  return `DL${String(index + 1).padStart(7, '0')}`
}

function generateTrackingNo(): string {
  const prefix = ['TH', 'BKK', 'CNX', 'HDY'][randomNumber(0, 3)]
  const number = randomNumber(100000000, 999999999)

  return `${prefix}${number}`
}

const carriers = [
  'Kerry Express',
  'Flash Express',
  'J&T Express',
  'Thailand Post',
  'DHL Express',
  'Nim Express'
]

const routes = [
  'Bangkok - Central',
  'Bangkok - North',
  'Bangkok - Northeast',
  'Bangkok - East',
  'Bangkok - South',
  'Regional Express'
]

const receiverNames = [
  'นายสมชาย วัฒนา',
  'นางสาวกานต์ ศรีสุข',
  'นายประเสริฐ มั่นคง',
  'นางพิมพ์ใจ ใจดี',
  'นายวิชัย เจริญ',
  'นางสาวนิภา สุขสันต์',
  'นายสุรชัย ดีงาม',
  'นางมาลี บุญมี'
]

// GPS locations for different regions in Thailand
const thailandLocations = {
  bangkok: { lat: 13.7563, lng: 100.5018 },
  central: { lat: 14.3532, lng: 100.5697 },
  north: { lat: 18.7883, lng: 98.9853 },
  northeast: { lat: 15.8700, lng: 100.9925 },
  east: { lat: 13.3611, lng: 100.9847 },
  south: { lat: 7.8804, lng: 98.3923 }
}

// Generate GPS tracking data for deliveries
function generateTracking(status: string, route: string): DeliveryTracking | undefined {
  // Determine origin (always Bangkok warehouse)
  const origin: GPSCoordinates = thailandLocations.bangkok

  // Determine destination based on route
  let destination: GPSCoordinates

  if (route.includes('Central')) {
    destination = thailandLocations.central
  } else if (route.includes('North')) {
    destination = thailandLocations.north
  } else if (route.includes('Northeast')) {
    destination = thailandLocations.northeast
  } else if (route.includes('East')) {
    destination = thailandLocations.east
  } else if (route.includes('South')) {
    destination = thailandLocations.south
  } else {
    destination = { lat: origin.lat + (Math.random() - 0.5) * 2, lng: origin.lng + (Math.random() - 0.5) * 2 }
  }

  // Only add current location for in-transit deliveries
  let current_location: GPSCoordinates | undefined

  if (status === DeliveryStatus.InTransit) {
    // Simulate truck position between origin and destination (30% to 70% of the way)
    const progress = 0.3 + Math.random() * 0.4
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

// Generate POD for delivered items
function generatePOD(status: string): SAPPOD | undefined {
  if (status !== DeliveryStatus.Delivered) {
    return undefined
  }

  const hasPOD = Math.random() > 0.2 // 80% have POD

  if (!hasPOD) {
    return undefined
  }

  const hasSignature = Math.random() > 0.3 // 70% have signature
  const hasPhoto = Math.random() > 0.5 // 50% have photo

  return {
    signature_url: hasSignature ? `/signatures/sig_${randomNumber(1, 10)}.png` : undefined,
    photo_url: hasPhoto ? `/pod-photos/pod_${randomNumber(1, 15)}.jpg` : undefined,
    received_by: receiverNames[randomNumber(0, receiverNames.length - 1)],
    received_date: new Date(Date.now() - randomNumber(0, 30) * 24 * 60 * 60 * 1000),
    notes: Math.random() > 0.7 ? 'Delivered to warehouse' : undefined
  }
}

// Generate deliveries for completed or in-progress orders
const generateDeliveries = (): SAPDelivery[] => {
  const deliveries: SAPDelivery[] = []
  let deliveryIndex = 0

  // Get orders that should have deliveries
  const ordersWithDeliveries = mockSAPOrders.filter(order =>
    order.status === 'Delivered' ||
    order.status === 'In Progress' ||
    order.status === 'Partially Delivered'
  )

  ordersWithDeliveries.forEach((order) => {
    // Some orders might have multiple deliveries (partial deliveries)
    const deliveryCount = order.status === 'Partially Delivered' ? randomNumber(1, 2) : 1

    for (let i = 0; i < deliveryCount; i++) {
      const status = randomEnum(DeliveryStatus)
      const plannedDate = new Date(order.order_date)
      plannedDate.setDate(plannedDate.getDate() + randomNumber(5, 15))

      let actualDate: Date | undefined

      if (status === DeliveryStatus.Delivered) {
        actualDate = new Date(plannedDate)
        actualDate.setDate(actualDate.getDate() + randomNumber(-2, 3))
      } else if (status === DeliveryStatus.InTransit) {
        actualDate = undefined
      }

      // Generate delivery items from order lines
      const orderLines = getOrderLines(order.order_no)
      const deliveryItems: SAPDeliveryItem[] = orderLines.map((line, idx) => {
        const qtyOrdered = line.qty
        let qtyShipped: number

        if (status === DeliveryStatus.Delivered) {
          qtyShipped = qtyOrdered
        } else if (status === DeliveryStatus.InTransit) {
          qtyShipped = qtyOrdered
        } else if (status === DeliveryStatus.Planned) {
          qtyShipped = 0
        } else {
          qtyShipped = randomNumber(0, qtyOrdered)
        }

        return {
          line_no: (idx + 1) * 10,
          material_code: line.material_code,
          description: line.description,
          description_thai: line.description_thai,
          qty_ordered: qtyOrdered,
          qty_shipped: qtyShipped,
          uom: line.uom
        }
      })

      const route = routes[randomNumber(0, routes.length - 1)]

      deliveries.push({
        delivery_no: generateDeliveryNo(deliveryIndex++),
        order_no: order.order_no,
        customer_no: order.customer_no,
        customer_name: order.customer_name,
        planned_date: plannedDate,
        actual_date: actualDate,
        status: status,
        carrier: carriers[randomNumber(0, carriers.length - 1)],
        route: route,
        tracking_no: generateTrackingNo(),
        pod_available: status === DeliveryStatus.Delivered,
        pod: generatePOD(status),
        items: deliveryItems,
        tracking: generateTracking(status, route)
      })
    }
  })

  // Sort by planned date descending (newest first)
  return deliveries.sort((a, b) => b.planned_date.getTime() - a.planned_date.getTime())
}

export const mockSAPDeliveries: SAPDelivery[] = generateDeliveries()

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
