const fs = require('fs');
const path = require('path');

// Read customers data
const customersPath = path.join(__dirname, '../mock-data/customers.json');
const customers = JSON.parse(fs.readFileSync(customersPath, 'utf-8'));

const customerNos = customers.map(c => c.customer_no);
const customerNames = customers.map(c => c.legal_name);

// Document types and statuses
const docTypes = ['Standard Order', 'Rush Order', 'Consignment Order'];
const orderStatuses = ['Open', 'In Progress', 'Delivered', 'Partially Delivered'];
const deliveryStatuses = ['Planned', 'In Transit', 'Delivered'];
const invoiceStatuses = ['Open', 'Paid', 'Overdue', 'Partially Paid'];
const carriers = ['Kerry Express', 'Flash Express', 'J&T Express', 'Thailand Post', 'SCG Logistics', 'Best Express'];
const routes = ['Bangkok - Central', 'Bangkok - North', 'Bangkok - Northeast', 'Bangkok - East', 'Bangkok - South'];
const paymentTerms = ['NET 30', 'NET 45', 'NET 60'];

// Generate random date within range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Add days to date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Random number between min and max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random item from array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate Orders
function generateOrders(count) {
  const orders = [];
  // Generate orders from last 12 months for more realistic current data
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12);

  for (let i = 1; i <= count; i++) {
    const orderNo = `SO${String(i).padStart(7, '0')}`;
    const orderDate = randomDate(startDate, endDate);
    const docType = randomItem(docTypes);
    const netValue = randomInt(100000, 3000000);

    // Weight status towards delivered/in progress for realistic data
    const statusRand = Math.random();
    let status;
    if (statusRand < 0.6) {
      status = 'Delivered';
    } else if (statusRand < 0.8) {
      status = 'In Progress';
    } else if (statusRand < 0.9) {
      status = 'Partially Delivered';
    } else {
      status = 'Open';
    }

    const customerIndex = randomInt(0, customerNos.length - 1);
    const customerNo = customerNos[customerIndex];
    const customerName = customerNames[customerIndex];
    const itemsCount = randomInt(1, 15);

    let deliveryDate = null;
    if (status === 'Delivered' || status === 'In Progress' || status === 'Partially Delivered') {
      deliveryDate = addDays(orderDate, randomInt(7, 30));
    }

    orders.push({
      order_no: orderNo,
      order_date: orderDate.toISOString(),
      doc_type: docType,
      net_value: netValue,
      status: status,
      customer_no: customerNo,
      customer_name: customerName,
      delivery_date: deliveryDate ? deliveryDate.toISOString() : null,
      items_count: itemsCount
    });
  }

  return orders.sort((a, b) => new Date(a.order_date) - new Date(b.order_date));
}

// Generate Deliveries
function generateDeliveries(orders) {
  const deliveries = [];
  let deliveryCounter = 1;

  orders.forEach(order => {
    // Only generate deliveries for orders that are not "Open"
    if (order.status !== 'Open') {
      const deliveryNo = `DL${String(deliveryCounter).padStart(7, '0')}`;
      deliveryCounter++;

      const orderDate = new Date(order.order_date);
      const plannedDate = order.delivery_date ? new Date(order.delivery_date) : addDays(orderDate, randomInt(7, 21));

      let status;
      let actualDate = null;
      let podAvailable = false;

      if (order.status === 'Delivered') {
        status = 'Delivered';
        actualDate = addDays(plannedDate, randomInt(-2, 3));
        podAvailable = Math.random() > 0.2; // 80% have POD
      } else if (order.status === 'In Progress') {
        status = Math.random() > 0.5 ? 'In Transit' : 'Planned';
      } else if (order.status === 'Partially Delivered') {
        status = 'Delivered';
        actualDate = addDays(plannedDate, randomInt(-2, 3));
        podAvailable = Math.random() > 0.3;
      }

      const trackingPrefix = ['TH', 'BKK', 'CNX', 'HKT', 'HDY'][randomInt(0, 4)];
      const trackingNo = `${trackingPrefix}${randomInt(100000000, 999999999)}`;

      deliveries.push({
        delivery_no: deliveryNo,
        order_no: order.order_no,
        customer_no: order.customer_no,
        customer_name: order.customer_name,
        planned_date: plannedDate.toISOString(),
        actual_date: actualDate ? actualDate.toISOString() : null,
        status: status,
        carrier: randomItem(carriers),
        route: randomItem(routes),
        tracking_no: trackingNo,
        pod_available: podAvailable
      });
    }
  });

  return deliveries;
}

// Generate Invoices
function generateInvoices(orders) {
  const invoices = [];
  let invoiceCounter = 1;
  const today = new Date();

  orders.forEach(order => {
    // Generate invoices for delivered or partially delivered orders
    if (order.status === 'Delivered' || order.status === 'Partially Delivered' || Math.random() > 0.7) {
      const invoiceNo = `INV2024${String(invoiceCounter).padStart(7, '0')}`;
      invoiceCounter++;

      const orderDate = new Date(order.order_date);
      const invoiceDate = order.delivery_date
        ? addDays(new Date(order.delivery_date), randomInt(1, 5))
        : addDays(orderDate, randomInt(10, 25));

      const paymentTerm = randomItem(paymentTerms);
      const termDays = parseInt(paymentTerm.split(' ')[1]);
      const dueDate = addDays(invoiceDate, termDays);

      const amount = order.net_value;
      let paidAmount = 0;
      let balance = amount;
      let status = 'Open';
      let daysOverdue = 0;

      const isPastDue = dueDate < today;
      const daysSinceInvoice = Math.floor((today - invoiceDate) / (1000 * 60 * 60 * 24));

      // Determine payment status with more realistic distribution
      // Older invoices more likely to be paid
      const paymentProbability = Math.min(0.95, daysSinceInvoice / (termDays * 1.5));
      const rand = Math.random();

      if (rand < paymentProbability * 0.85) {
        // Most invoices are fully paid (especially older ones)
        paidAmount = amount;
        balance = 0;
        status = 'Paid';
      } else if (rand < paymentProbability * 0.95) {
        // Some are partially paid
        paidAmount = Math.floor(amount * (0.4 + Math.random() * 0.5));
        balance = amount - paidAmount;
        status = isPastDue ? 'Overdue' : 'Partially Paid';
        if (isPastDue) {
          daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        }
      } else {
        // Recent invoices more likely to be open (not yet due)
        // Very old invoices have small chance of being overdue
        paidAmount = 0;
        balance = amount;

        if (isPastDue && Math.random() < 0.2) {
          // Only 20% of past due become actually overdue (others get paid on time)
          status = 'Overdue';
          daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        } else if (isPastDue) {
          // Mark as paid if past due but not in the 20% overdue group
          paidAmount = amount;
          balance = 0;
          status = 'Paid';
        } else {
          status = 'Open';
        }
      }

      invoices.push({
        invoice_no: invoiceNo,
        customer_no: order.customer_no,
        customer_name: order.customer_name,
        invoice_date: invoiceDate.toISOString(),
        due_date: dueDate.toISOString(),
        amount: amount,
        paid_amount: paidAmount,
        balance: balance,
        status: status,
        payment_terms: paymentTerm,
        reference_order: order.order_no,
        days_overdue: daysOverdue
      });
    }
  });

  return invoices.sort((a, b) => new Date(a.invoice_date) - new Date(b.invoice_date));
}

// Generate data
console.log('Generating mock data...');
const orders = generateOrders(250);
const deliveries = generateDeliveries(orders);
const invoices = generateInvoices(orders);

console.log(`Generated ${orders.length} orders`);
console.log(`Generated ${deliveries.length} deliveries`);
console.log(`Generated ${invoices.length} invoices`);

// Write to files
const ordersPath = path.join(__dirname, '../mock-data/orders.json');
const deliveriesPath = path.join(__dirname, '../mock-data/deliveries.json');
const invoicesPath = path.join(__dirname, '../mock-data/invoices.json');

fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
fs.writeFileSync(deliveriesPath, JSON.stringify(deliveries, null, 2));
fs.writeFileSync(invoicesPath, JSON.stringify(invoices, null, 2));

console.log('Mock data generated successfully!');
console.log(`- Orders: ${ordersPath}`);
console.log(`- Deliveries: ${deliveriesPath}`);
console.log(`- Invoices: ${invoicesPath}`);
