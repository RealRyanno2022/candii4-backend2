const sendEmail = async (to, subject, text) => {
    const mailOptions = {
      from: 'ryannobusiness@gmail.com',
      to: to,
      subject: subject,
      text: text
    };
  
    try {
      await transport.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email: ', error);
    }
  }

module.exports = sendEmail;