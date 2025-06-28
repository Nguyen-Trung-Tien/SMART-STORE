const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailResetPassword = async (email, resetLink) => {
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

    const info = await transporter.sendMail({
      from: process.env.EMAIL_ACCOUNT,
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
      text: "Smart-Store Password Reset",
      html: `
        <div>
          <p>Chào bạn,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link dưới đây để đặt lại:</p>
          <a href="${resetLink}">Đặt lại mật khẩu</a>
          <p>Link này sẽ hết hạn sau 1 giờ.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          <p>-- Smart-Store --</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to send reset password email");
  }
};

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

module.exports = { sendEmailCreateOrder, sendEmailResetPassword };
