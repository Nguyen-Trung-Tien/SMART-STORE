const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let listItem = "";
    const attachImage = [];
    orderItems?.forEach((order) => {
      listItem += `
      <div>
        <p>Bạn đã đặt sản phẩm: <b>${order?.name}</b></p>
        <div>
          <img src="${order?.image}" style="max-width: 200px;"/>
        </div>
        <p>với số lượng: <b>${order?.amount}</b> 
        <b> ,giá: ${order?.price
          .toLocaleString()
          .replaceAll(",", ".")}VND</b></p>
      </div>`;
      attachImage.push({
        filename: order?.name,
        path: order?.image,
      });
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_ACCOUNT,
      to: process.env.EMAIL_ACCOUNT,
      subject: "Bạn đã đặt hàng thành công",
      text: "Shop Smart-Store.",
      html: `
        <div>
          <b>Bạn đã đặt hàng thành công từ shop Smart-Store</b>
        </div>
        ${listItem}`,
      attachments: attachImage,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmailCreateOrder };
