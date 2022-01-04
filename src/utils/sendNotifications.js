/* eslint-disable import/prefer-default-export */
const nodeMailer = require('nodemailer');

export const sendEmail = async (payload) => {
  const { senderEmail, receipientEmail, subject, content } = payload;
  console.log(payload);
  try {
    const transporter = nodeMailer.createTransport({
      // host: process.env.MAIL_HOST,
      service: process.env.MAIL_SERVICE,
      // port: 587,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: receipientEmail,
      subject,
      html: content,
    });
    console.log('email sent sucessfully');
  } catch (error) {
    console.log('email not sent');
    console.log(error);
  }
};

export const sendSMS = async (payload) => {
  const { senderPhone, receipientPhone, subject, content } = payload;
  console.log(payload);
};
