export interface Product {
  sku: string
  name_thai: string
  name_english: string
  category: string
  unit: string
  gsm_options?: number[]
  size_options?: string[]
}

export const mockProducts: Product[] = [
  // Printing & Packaging Paper Group
  {
    sku: 'AC1S',
    name_thai: 'อาร์ตการ์ด 1 หน้า',
    name_english: 'Art Card 1-side',
    category: 'Printing & Packaging',
    unit: 'ream',
    gsm_options: [190, 210, 230, 250, 260, 300, 350],
    size_options: ['A3', 'A4', '31x43"', '25x35"']
  },
  {
    sku: 'AC2S',
    name_thai: 'กระดาษอาร์ตการ์ด 2 หน้า',
    name_english: 'Art Card 2-sides',
    category: 'Printing & Packaging',
    unit: 'ream',
    gsm_options: [190, 210, 230, 250, 260, 300, 350],
    size_options: ['A3', 'A4', '31x43"', '25x35"']
  },
  {
    sku: 'ACG',
    name_thai: 'กระดาษอาร์ตมันมัน',
    name_english: 'Coated Art Paper - Gloss',
    category: 'Printing & Packaging',
    unit: 'ream',
    gsm_options: [100, 115, 128, 150, 170],
    size_options: ['A3', 'A4', '31x43"']
  },
  {
    sku: 'ACM',
    name_thai: 'กระดาษอาร์ตมันด้าน',
    name_english: 'Coated Art Paper - Matt',
    category: 'Printing & Packaging',
    unit: 'ream',
    gsm_options: [100, 115, 128, 150, 170],
    size_options: ['A3', 'A4', '31x43"']
  },
  {
    sku: 'STK',
    name_thai: 'กระดาษสติ๊กเกอร์',
    name_english: 'Sticker Paper',
    category: 'Printing & Packaging',
    unit: 'ream',
    gsm_options: [80, 100, 120],
    size_options: ['A3', 'A4']
  },
  {
    sku: 'KFT',
    name_thai: 'กระดาษคราฟท์น้ำตาล',
    name_english: 'Brown Kraft Paper',
    category: 'Printing & Packaging',
    unit: 'kg',
    gsm_options: [80, 100, 125, 150, 175, 200],
    size_options: ['Roll', 'Sheet']
  },
  {
    sku: 'MGK',
    name_thai: 'กระดาษ MG Kraft',
    name_english: 'MG Kraft Paper',
    category: 'Printing & Packaging',
    unit: 'kg',
    gsm_options: [80, 100, 125],
    size_options: ['Roll']
  },
  {
    sku: 'PRF',
    name_thai: 'กระดาษปรู๊ฟ',
    name_english: 'Proof Paper',
    category: 'Printing & Packaging',
    unit: 'ream',
    gsm_options: [45, 48, 52],
    size_options: ['A3', 'A4']
  },
  {
    sku: 'EYE',
    name_thai: 'กระดาษถนอมสายตา',
    name_english: 'Eye-care Paper',
    category: 'Printing & Packaging',
    unit: 'ream',
    gsm_options: [70, 80],
    size_options: ['A4']
  },
  {
    sku: 'WCD',
    name_thai: 'การ์ดขาว',
    name_english: 'White Card',
    category: 'Printing & Packaging',
    unit: 'ream',
    gsm_options: [190, 210, 230, 260, 300],
    size_options: ['A3', 'A4', '25x35"']
  },
  {
    sku: 'GBD',
    name_thai: 'กล่องแป้งหลังเทา',
    name_english: 'Grey-back Duplex',
    category: 'Printing & Packaging',
    unit: 'ream',
    gsm_options: [230, 250, 270, 300, 350],
    size_options: ['31x43"', '25x35"']
  },
  {
    sku: 'BND',
    name_thai: 'กระดาษปอนด์',
    name_english: 'Bond Paper',
    category: 'Printing & Packaging',
    unit: 'ream',
    gsm_options: [70, 80, 100],
    size_options: ['A3', 'A4']
  },
  // Carbonless Paper Products
  {
    sku: 'NCR2',
    name_thai: 'กระดาษต่อเนื่อง 2 ชั้น',
    name_english: 'Carbonless Paper 2-ply',
    category: 'Carbonless',
    unit: 'box',
    gsm_options: [56],
    size_options: ['9.5x11"', '9.5x5.5"']
  },
  {
    sku: 'NCR3',
    name_thai: 'กระดาษต่อเนื่อง 3 ชั้น',
    name_english: 'Carbonless Paper 3-ply',
    category: 'Carbonless',
    unit: 'box',
    gsm_options: [56],
    size_options: ['9.5x11"', '9.5x5.5"']
  },
  {
    sku: 'NCR4',
    name_thai: 'กระดาษต่อเนื่อง 4 ชั้น',
    name_english: 'Carbonless Paper 4-ply',
    category: 'Carbonless',
    unit: 'box',
    gsm_options: [56],
    size_options: ['9.5x11"']
  },
  // Office Products
  {
    sku: 'GOA4-70',
    name_thai: 'กระดาษถ่ายเอกสาร Go On A4 70gsm',
    name_english: 'Go On Copy Paper A4 70gsm',
    category: 'Office',
    unit: 'ream',
    gsm_options: [70],
    size_options: ['A4']
  },
  {
    sku: 'GOA4-80',
    name_thai: 'กระดาษถ่ายเอกสาร Go On A4 80gsm',
    name_english: 'Go On Copy Paper A4 80gsm',
    category: 'Office',
    unit: 'ream',
    gsm_options: [80],
    size_options: ['A4']
  },
  {
    sku: 'GOA3-80',
    name_thai: 'กระดาษถ่ายเอกสาร Go On A3 80gsm',
    name_english: 'Go On Copy Paper A3 80gsm',
    category: 'Office',
    unit: 'ream',
    gsm_options: [80],
    size_options: ['A3']
  },
  {
    sku: 'GOT80',
    name_thai: 'กระดาษพิมพ์ใบเสร็จชนิดไวความร้อน Go On 80x80mm',
    name_english: 'Go On Thermal Receipt Paper 80x80mm',
    category: 'Office',
    unit: 'roll',
    size_options: ['80x80mm']
  },
  // Packaging Products
  {
    sku: 'FPK',
    name_thai: 'บรรจุภัณฑ์กระดาษสำหรับอาหาร',
    name_english: 'Food-grade Paper Packaging',
    category: 'Packaging',
    unit: 'piece',
    size_options: ['Small', 'Medium', 'Large', 'XL']
  }
]

export function getProductBySKU(sku: string): Product | undefined {
  return mockProducts.find(p => p.sku === sku)
}

export function getRandomProducts(count: number): Product[] {
  // Return first N products (deterministic for POC)
  return mockProducts.slice(0, Math.min(count, mockProducts.length))
}
