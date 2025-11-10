import { SAPOrderLine } from '../types/sap'
import { mockSAPOrders } from './sap-orders'
import { mockProducts } from './products'

// Simple static mapping of order lines
const orderLinesMap = new Map<string, SAPOrderLine[]>()

// Generate simple order lines for each order
mockSAPOrders.forEach((order) => {
  const lines: SAPOrderLine[] = []
  const productsToUse = mockProducts.slice(0, order.items_count)
  const valuePerItem = Math.floor(order.net_value / order.items_count)

  productsToUse.forEach((product, index) => {
    const qty = 100 + (index * 50)
    const unitPrice = index === productsToUse.length - 1
      ? Math.floor((order.net_value - (valuePerItem * (productsToUse.length - 1))) / qty)
      : Math.floor(valuePerItem / qty)

    lines.push({
      line_no: (index + 1) * 10,
      material_code: product.sku,
      description: product.name_english,
      description_thai: product.name_thai,
      qty: qty,
      uom: product.unit,
      unit_price: unitPrice,
      net_price: qty * unitPrice,
      gsm: product.gsm_options?.[0],
      size: product.size_options?.[0]
    })
  })

  orderLinesMap.set(order.order_no, lines)
})

export function getOrderLines(orderNo: string): SAPOrderLine[] {
  return orderLinesMap.get(orderNo) || []
}

export function getOrderLine(orderNo: string, lineNo: number): SAPOrderLine | undefined {
  const lines = orderLinesMap.get(orderNo)

  return lines?.find(line => line.line_no === lineNo)
}
