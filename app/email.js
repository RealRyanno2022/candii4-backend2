const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rhythmly.verify@gmail.com',
    pass: 'blackmamba13'
  }
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'rhythmly.verify@gmail.com',
    to: 'ryannobusiness@gmail.com',
    subject: "Wassup beijing",
    text: "Yes"
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};



module.exports = sendEmail;