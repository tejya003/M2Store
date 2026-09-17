const axios = require('axios');

const sendEmail = async (to, subject, text) => {
  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { email: process.env.EMAIL_USER, name: 'M2 Store' },
      to: [{ email: to }],
      subject: subject,
      textContent: text
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );
};

module.exports = sendEmail;