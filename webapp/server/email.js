const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = (to, html) =>
  new Promise((resolve, reject) => transporter.sendMail({
    from: '"Team Cloud Preventivo In Cantiere" <admin@cloudpreventivoincantiere.it>',
    to,
    subject: 'Preventivo',
    html,
  }, (err, res) => {
    if (err) {
      reject(err);
    } else {
      resolve(res);
    }
  }));
