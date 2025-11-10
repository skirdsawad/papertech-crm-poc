import { SAPCustomerSnapshot, CustomerSegment, Territory, PaymentTerms } from '../types/sap'

const thaiCompanyNames = [
  'บริษัท สยามกระดาษ จำกัด',
  'บริษัท ไทยแพ็คเกจจิ้ง จำกัด',
  'บริษัท กรุงเทพพริ้นติ้ง จำกัด',
  'บริษัท นครสวรรค์เปเปอร์ จำกัด',
  'บริษัท อมรพริ้นติ้งแอนด์พับลิชชิ่ง จำกัด',
  'บริษัท เชียงใหม่คอนเวอร์ติ้ง จำกัด',
  'บริษัท ภูเก็ตเปเปอร์ดิสทริบิวชั่น จำกัด',
  'บริษัท ระยองพริ้นท์เทค จำกัด',
  'บริษัท ขอนแก่นแพ็คเกจจิ้ง จำกัด',
  'บริษัท สุราษฎร์ธานีกระดาษ จำกัด',
  'บริษัท นนทบุรีพริ้นติ้ง จำกัด',
  'บริษัท ปทุมธานีเปเปอร์ จำกัด',
  'บริษัท สมุทรปราการแพ็ค จำกัด',
  'บริษัท ชลบุรีคอนเวิร์ท จำกัด',
  'บริษัท อยุธยาพับลิชชิ่ง จำกัด',
  'บริษัท หาดใหญ่เปเปอร์ จำกัด',
  'บริษัท อุดรธานีพริ้นต์ จำกัด',
  'บริษัท นครราชสีมาแพ็ค จำกัด',
  'บริษัท เพชรบุรีกระดาษ จำกัด',
  'บริษัท ประจวบคีรีขันธ์เปเปอร์ จำกัด',
  'บริษัท ตรังพริ้นติ้ง จำกัด',
  'บริษัท กระบี่แพ็คเกจจิ้ง จำกัด',
  'บริษัท พังงาเปเปอร์ จำกัด',
  'บริษัท สุโขทัยพริ้นท์ จำกัด',
  'บริษัท พิษณุโลกคอนเวอร์ท จำกัด',
  'บริษัท เชียงรายกระดาษ จำกัด',
  'บริษัท ลำปางพริ้นติ้ง จำกัด',
  'บริษัท แม่ฮ่องสอนเปเปอร์ จำกัด',
  'บริษัท น่านพับลิชชิ่ง จำกัด',
  'บริษัท พะเยาแพ็ค จำกัด',
  'บริษัท อุบลราชธานีพริ้นท์ จำกัด',
  'บริษัท ยโสธรเปเปอร์ จำกัด',
  'บริษัท ร้อยเอ็ดกระดาษ จำกัด',
  'บริษัท สกลนครพริ้นติ้ง จำกัด',
  'บริษัท บุรีรัมย์แพ็คเกจจิ้ง จำกัด',
  'บริษัท สุรินทร์เปเปอร์ จำกัด',
  'บริษัท ศรีสะเกษพริ้นท์ จำกัด',
  'บริษัท จันทบุรีคอนเวอร์ท จำกัด',
  'บริษัท ตราดกระดาษ จำกัด',
  'บริษัท ระนองเปเปอร์ จำกัด',
  'บริษัท ชุมพรพริ้นติ้ง จำกัด',
  'บริษัท สุราษฎร์แพ็ค จำกัด',
  'บริษัท นครศรีธรรมราชพับลิช จำกัด',
  'บริษัท สงขลาเปเปอร์ดิส จำกัด',
  'บริษัท ปัตตานีพริ้นท์ จำกัด',
  'บริษัท ยะลากระดาษ จำกัด',
  'บริษัท นราธิวาสแพ็ค จำกัด',
  'บริษัท กาญจนบุรีเปเปอร์ จำกัด',
  'บริษัท สุพรรณบุรีพริ้นท์ จำกัด',
  'บริษัท ราชบุรีคอนเวอร์ติ้ง จำกัด'
]

function generateTaxId(index: number): string {
  const base = 1000000000000 + (index * 11111)

  return base.toString().substring(0, 13)
}

function generateCustomerNo(index: number): string {
  return `SAP${String(index + 1).padStart(6, '0')}`
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomEnum<T extends object>(enumObj: T): T[keyof T] {
  const values = Object.values(enumObj) as T[keyof T][]

  return values[randomNumber(0, values.length - 1)]
}

export const mockSAPCustomers: SAPCustomerSnapshot[] = Array.from({ length: 50 }, (_, index) => {
  const creditLimit = randomNumber(500000, 10000000)
  const creditExposure = randomNumber(0, creditLimit)
  const creditAvailable = creditLimit - creditExposure

  const bucket0_30 = randomNumber(0, 200000)
  const bucket31_60 = randomNumber(0, 150000)
  const bucket61_90 = randomNumber(0, 100000)
  const bucket90_plus = randomNumber(0, 50000)

  return {
    customer_no: generateCustomerNo(index),
    sales_org: '1000',
    legal_name: thaiCompanyNames[index],
    tax_id: generateTaxId(index),
    payment_terms: randomEnum(PaymentTerms),
    credit_limit: creditLimit,
    credit_exposure: creditExposure,
    credit_available: creditAvailable,
    overdue_aging: {
      bucket_0_30: bucket0_30,
      bucket_31_60: bucket31_60,
      bucket_61_90: bucket61_90,
      bucket_90_plus: bucket90_plus
    },
    negotiated_pricing_active: Math.random() > 0.5,
    segment: randomEnum(CustomerSegment),
    territory: randomEnum(Territory),
    lastUpdated: new Date(Date.now() - randomNumber(1, 900000)) // Random time within last 15 minutes
  }
})

// Helper function to get customer by customer_no
export function getSAPCustomerByNo(customerNo: string): SAPCustomerSnapshot | undefined {
  return mockSAPCustomers.find(c => c.customer_no === customerNo)
}

// Helper function to search customers
export function searchSAPCustomers(query: string): SAPCustomerSnapshot[] {
  const lowerQuery = query.toLowerCase()

  return mockSAPCustomers.filter(c =>
    c.customer_no.toLowerCase().includes(lowerQuery) ||
    c.legal_name.toLowerCase().includes(lowerQuery) ||
    c.tax_id.includes(query)
  )
}
