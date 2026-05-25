import PDFDocument from 'pdfkit';
import fs from 'fs';

const generateInvoice = (order, path) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });

      generateHeader(doc);
      generateCustomerInformation(doc, order);
      generateInvoiceTable(doc, order);
      generateFooter(doc);

      doc.end();
      doc.pipe(fs.createWriteStream(path)).on('finish', resolve).on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
};

const generateHeader = (doc) => {
  doc
    .image('src/assets/logo.png', 50, 45, { width: 50 })
    .fillColor('#444444')
    .fontSize(20)
    .text('SMART STORE', 110, 57)
    .fontSize(10)
    .text('123 Street Name', 200, 65, { align: 'right' })
    .text('City, State, 12345', 200, 80, { align: 'right' })
    .moveDown();
};

const generateCustomerInformation = (doc, order) => {
  const shipping = order.shippingAddress;

  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('Invoice', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(order._id, 150, customerInformationTop)
    .font('Helvetica')
    .text('Invoice Date:', 50, customerInformationTop + 15)
    .text(formatDate(new Date()), 150, customerInformationTop + 15)
    .text('Balance Due:', 50, customerInformationTop + 30)
    .font('Helvetica-Bold')
    .text(formatCurrency(order.totalPrice), 150, customerInformationTop + 30)

    .font('Helvetica-Bold')
    .text(shipping.fullName, 300, customerInformationTop)
    .font('Helvetica')
    .text(shipping.address, 300, customerInformationTop + 15)
    .text(
      shipping.city,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
};

const generateInvoiceTable = (doc, order) => {
  let i;
  const invoiceTableTop = 330;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Item',
    'Description',
    'Unit Cost',
    'Quantity',
    'Line Total'
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  for (i = 0; i < order.orderItems.length; i++) {
    const item = order.orderItems[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      i + 1,
      item.name,
      formatCurrency(item.price),
      item.amount,
      formatCurrency(item.price * item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    'Subtotal',
    '',
    formatCurrency(order.itemsPrice)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    '',
    '',
    'Shipping Fee',
    '',
    formatCurrency(order.shippingPrice)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    duePosition,
    '',
    '',
    'Total Price',
    '',
    formatCurrency(order.totalPrice)
  );
  doc.font('Helvetica');
};

const generateFooter = (doc) => {
  doc
    .fontSize(10)
    .text(
      'Thank you for your business.',
      50,
      780,
      { align: 'center', width: 500 }
    );
};

const generateTableRow = (
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) => {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 0, y, { align: 'right' });
};

const generateHr = (doc, y) => {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
};

const formatCurrency = (cents) => {
  return cents.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + '/' + month + '/' + day;
};

export default {
  generateInvoice,
};