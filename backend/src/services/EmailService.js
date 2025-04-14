const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  let listItem = "";
  orderItems.forEach((order) => {
    listItem += `
    <div>Bạn đã đặt sản phẩm:<b>${order?.name}</b>
    <div>
    <img src=${order?.image} alt="img"/>
    </div>
    <div>với số lượng:<b>${order?.amount}</b>và giá:<b>${order?.price}</b></div>
    </div>
    </div>`;
  });
  const info = await transporter.sendMail({
    from: process.env.EMAIL_ACCOUNT, // sender address
    to: "tien83442@gmail.com", // list of receivers
    subject: "Bạn đã đặt hàng thành công", // Subject line
    text: "Hello world?", // plain text body
    html: `<div><b>Bạn đã đặt hàng thành công của shop Smart-Store</b></div>${orderItems}`, // html body
  });
};

module.exports = { sendEmailCreateOrder };
