const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
  try {
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
    orderItems?.forEach((order) => {
      listItem += `
      <div>
        <p>Bạn đã đặt sản phẩm: <b>${order?.name}</b></p>
        <div>
          <img src="${order?.image}" alt="img" style="max-width: 200px;"/>
        </div>
        <p>với số lượng: <b>${order?.amount}</b> và giá: <b>${order?.price}</b></p>
      </div>`;
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_ACCOUNT, // sender address
      to: process.env.EMAIL_ACCOUNT, // recipient email
      subject: "Bạn đã đặt hàng thành công", // Subject line
      text: "Bạn đã đặt hàng thành công của shop Smart-Store.", // plain text body
      html: `
        <div>
          <b>Bạn đã đặt hàng thành công của shop Smart-Store</b>
        </div>
        ${listItem}`, // html body
    });

    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmailCreateOrder };
