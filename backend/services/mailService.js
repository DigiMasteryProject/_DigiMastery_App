// services/mailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class MailService {
  async sendSuggestion(fromEmail, username, userId, message) {
    await transporter.sendMail({
      from: `"DigiMastery Feedback" <${process.env.EMAIL_USER}>`,
      to: "digimstrypct@gmail.com",

      // 🔥 responder directamente al usuario
      replyTo: fromEmail,

      // 🔥 asunto dinámico
      subject: `[DigiMastery] Suggestion from ${username}`,

      // 🔥 versión texto plano
      text: `
User: ${username}
User ID: ${userId}
Email: ${fromEmail}

-------------------------

${message}
      `,

      // 🔥 versión HTML bonita
      html: `
        <div style="
          font-family: monospace;
          background-color: #0a1628;
          color: #00d9ff;
          padding: 20px;
          border-radius: 10px;
        ">
          <h2 style="color:#ffa500;">
            DigiMastery Suggestion Box
          </h2>

          <p>
            <b>User:</b> ${username}
          </p>

          <p>
            <b>User ID:</b> ${userId}
          </p>

          <p>
            <b>Email:</b> ${fromEmail}
          </p>

          <hr style="border-color:#00d9ff;" />

          <p style="white-space: pre-wrap;">
            ${message}
          </p>
        </div>
      `,
    });
  }
}

module.exports = new MailService();