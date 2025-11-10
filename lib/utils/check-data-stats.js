const fs = require('fs');
const path = require('path');

const invoicesPath = path.join(__dirname, '../mock-data/invoices.json');
const invoices = JSON.parse(fs.readFileSync(invoicesPath, 'utf-8'));

console.log('=== Invoice Statistics ===\n');
console.log(`Total Invoices: ${invoices.length}\n`);

// Status distribution
const statusCounts = invoices.reduce((acc, inv) => {
  acc[inv.status] = (acc[inv.status] || 0) + 1;
  return acc;
}, {});

console.log('Status Distribution:');
Object.entries(statusCounts).forEach(([status, count]) => {
  const pct = ((count / invoices.length) * 100).toFixed(1);
  console.log(`  ${status}: ${count} (${pct}%)`);
});

// Calculate totals
const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
const totalPaid = invoices.reduce((sum, inv) => sum + inv.paid_amount, 0);
const totalBalance = invoices.reduce((sum, inv) => sum + inv.balance, 0);
const overdueAmount = invoices
  .filter(inv => inv.status === 'Overdue')
  .reduce((sum, inv) => sum + inv.balance, 0);

console.log('\nFinancial Summary:');
console.log(`  Total Invoice Amount: ฿${totalAmount.toLocaleString()}`);
console.log(`  Total Paid: ฿${totalPaid.toLocaleString()}`);
console.log(`  Total Outstanding: ฿${totalBalance.toLocaleString()}`);
console.log(`  Overdue Amount: ฿${overdueAmount.toLocaleString()}`);
console.log(`  Collection Rate: ${((totalPaid / totalAmount) * 100).toFixed(1)}%`);

// Sample some customers
const ordersPath = path.join(__dirname, '../mock-data/orders.json');
const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));

console.log(`\n=== Order Statistics ===\n`);
console.log(`Total Orders: ${orders.length}\n`);

const orderStatusCounts = orders.reduce((acc, ord) => {
  acc[ord.status] = (acc[ord.status] || 0) + 1;
  return acc;
}, {});

console.log('Order Status Distribution:');
Object.entries(orderStatusCounts).forEach(([status, count]) => {
  const pct = ((count / orders.length) * 100).toFixed(1);
  console.log(`  ${status}: ${count} (${pct}%)`);
});

// Sample customer analytics
console.log('\n=== Sample Customer Analysis (SAP000001) ===\n');
const customerNo = 'SAP000001';
const customerOrders = orders.filter(o => o.customer_no === customerNo);
const customerInvoices = invoices.filter(i => i.customer_no === customerNo);

console.log(`Orders: ${customerOrders.length}`);
console.log(`Invoices: ${customerInvoices.length}`);

const custTotalInvoiced = customerInvoices.reduce((sum, inv) => sum + inv.amount, 0);
const custPaid = customerInvoices.reduce((sum, inv) => sum + inv.paid_amount, 0);
const custOverdue = customerInvoices
  .filter(inv => inv.status === 'Overdue')
  .reduce((sum, inv) => sum + inv.balance, 0);

console.log(`Total Invoiced: ฿${custTotalInvoiced.toLocaleString()}`);
console.log(`Total Paid: ฿${custPaid.toLocaleString()}`);
console.log(`Overdue: ฿${custOverdue.toLocaleString()}`);
console.log(`Paid Invoices: ${customerInvoices.filter(i => i.status === 'Paid').length}`);
console.log(`Overdue Invoices: ${customerInvoices.filter(i => i.status === 'Overdue').length}`);
