const braintree = require('braintree');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: '8wdhyhqpnsg7sfmx',
  publicKey: '7dgvvkf768mptyz2',
  privateKey: 'e0232aae435589c2233372965a5aa1ea',
});

const getClientToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response.clientToken);
    }
  });
};

const processPayment = (req, res) => {
  const { paymentMethodNonce, amount } = req.body;

  gateway.transaction.sale({
    amount,
    paymentMethodNonce,
    options: {
      submitForSettlement: true,
    },
  }, (err, result) => {
    if (err || !result.success) {
      res.status(500).send(err || 'Payment error');
    } else {
      res.send('Payment successful');
    }
  });
};

module.exports = {
  gateway,
  getClientToken,
  processPayment,
};