import { SAPOrderLine } from '../types/sap'
import { mockSAPOrders } from './sap-orders'
import { mockProducts, getRandomProducts } from './products'

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomElement<T>(array: T[]): T {
  return array[randomNumber(0, array.length - 1)]
}

// Generate order lines for each order
const generateOrderLines = (): Map<string, SAPOrderLine[]> => {
  const orderLinesMap = new Map<string, SAPOrderLine[]>()

  mockSAPOrders.forEach((order) => {
    const itemsCount = order.items_count
    const selectedProducts = getRandomProducts(itemsCount)
    const lines: SAPOrderLine[] = []

    let remainingValue = order.net_value

    selectedProducts.forEach((product, index) => {
      const isLastItem = index === selectedProducts.length - 1
      const qty = randomNumber(50, 500)

      let unitPrice: number
      if (isLastItem) {
        // For the last item, calculate unit price to match remaining value
        unitPrice = Math.round(remainingValue / qty)
      } else {
        // Random unit price based on product category
        const basePrice = product.category === 'Office' ? randomNumber(100, 300) :
                         product.category === 'Carbonless' ? randomNumber(500, 1500) :
                         product.category === 'Packaging' ? randomNumber(200, 800) :
                         randomNumber(300, 2000)

        unitPrice = basePrice
      }

      const netPrice = qty * unitPrice

      if (!isLastItem) {
        remainingValue -= netPrice
      }

      const gsm = product.gsm_options ? randomElement(product.gsm_options) : undefined
      const size = product.size_options ? randomElement(product.size_options) : undefined

      lines.push({
        line_no: (index + 1) * 10,
        material_code: product.sku,
        description: product.name_english,
        description_thai: product.name_thai,
        qty: qty,
        uom: product.unit,
        unit_price: unitPrice,
        net_price: netPrice,
        gsm: gsm,
        size: size
      })
    })

    orderLinesMap.set(order.order_no, lines)
  })

  return orderLinesMap
}

export const orderLinesMap: Map<string, SAPOrderLine[]> = generateOrderLines()

// Helper function to get order lines by order number
export function getOrderLines(orderNo: string): SAPOrderLine[] {
  return orderLinesMap.get(orderNo) || []
}

// Helper function to get order with lines
export function getOrderWithLines(orderNo: string) {
  const order = mockSAPOrders.find(o => o.order_no === orderNo)
  const lines = getOrderLines(orderNo)

  return {
    order,
    lines
  }
}
