import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NEXT_PUBLIC_NODEMAILER_APP_USER,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_APP_PASS,
  },
});

const sendmail = async (to: string, link: string) => {
  const mailOptions = {
    from: 'mohammedaffanansari56@gmail.com',
    to: to,
    subject: 'Reset your Password',
    html: `<p>Click <a href='${link}'>here</a> to reset your password</p>`
  };
  return transporter.sendMail(mailOptions)
}

export default sendmail;