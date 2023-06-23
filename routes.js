// Module imports
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser'); 
const auth = require('./auth');
const posts = require('./posts');
const sendEmail = require('./sendEmail');
const admin = require('firebase-admin');
const serviceAccount = require('./candii-a8618-firebase-adminsdk-ssavy-7006eb0d3a.json');
const braintreeModule = require('braintree');
const path = require('path');

// Braintree Setup
const gateway = new braintreeModule.BraintreeGateway({
  environment: braintreeModule.Environment.Sandbox,
  merchantId: '8wdhyhqpnsg7sfmx',
  publicKey: '7dgvvkf768mptyz2',
  privateKey: 'e0232aae435589c2233372965a5aa1ea',
});

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Setup Express app and middleware
const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json()); // Use body-parser middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); 

// Initialize router
const router = express.Router();

// Function Declarations
const getClientToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response.clientToken);
    }
  });
};

app.use(express.static(path.join(__dirname, 'public')));

const processPayment = (req, res) => {
  const { paymentMethodNonce, amount } = req.body;

  console.log('Processing payment...');
  console.log('paymentMethodNonce:', paymentMethodNonce);
  console.log('amount:', amount);

  if (!paymentMethodNonce || !amount) {
    console.error('Missing paymentMethodNonce or amount');
    return res.status(400).json({ error: 'Missing paymentMethodNonce or amount' });
  }

  gateway.transaction.sale({
    amount,
    paymentMethodNonce,
    options: {
      submitForSettlement: true,
    },
  }, (err, result) => {
    console.log('Transaction sale result:', result);
    console.log('Transaction sale error:', err);

    if (err || !result.success) {
      console.error('Payment error:', err || 'Payment error');
      return res.status(500).json({ error: err || 'Payment error' });
    } 

    console.log('Payment successful');
    res.json({ message: 'Payment successful' });
  });
};

// Route Handlers
router.get('/', (req, res) => { res.send('Server running'); });
router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/client_token', getClientToken);
router.post('/checkout', processPayment);
router.post('/execute_transaction', processPayment);

router.post('/posts', posts.createPost);
router.get('/posts', posts.getAllPosts);
router.get('/posts/:id', posts.getPostById);
router.put('/posts/:id', posts.updatePost);
router.delete('/posts/:id', posts.deletePost);

router.post('/send_email', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await sendEmail(to, subject, text);
    res.status(200).json({ message: 'Email sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email.', error: error.toString() });
  }
});

router.post('/save_user_information', async (req, res) => {
  if (!req.body || !req.body.state || !req.body.country || !req.body.email || !req.body.address || !req.body.phoneNumber || !req.body.postCode || !req.body.firstName || !req.body.lastName) {
    return res.status(400).send('Missing fields in request body');
  }
  
  const { state, country, email, address, phoneNumber, postCode, firstName, lastName } = req.body;

  try {
    const userRef = db.collection('users');
    
    // Check if user with this email already exists
    const snapshot = await userRef.where('email', '==', email).get();

    if (snapshot.empty) {
      // User does not exist, create new user document
      const newUserRef = userRef.doc();
      await newUserRef.set({
        state, 
        country, 
        email, 
        address, 
        phoneNumber, 
        postCode, 
        firstName, 
        lastName
      });
    } else {
      // User already exists, update user document
      let promises = snapshot.docs.map(doc => doc.ref.update({
        state, 
        country, 
        email, 
        address, 
        phoneNumber, 
        postCode, 
        firstName, 
        lastName
      }));

      await Promise.all(promises);
    }

    res.status(200).json({ message: 'User information saved successfully' });
  } catch (error) {
    console.error('Failed to save user information:', error);
    res.status(500).json({ message: 'Error saving user information', error: error.toString() });
  }
});

// Use the router
app.use(router);

// Start the server
const port = process.env.PORT || 19000; 
app.listen(port, function () {
  console.log('Express server is up and running on port ' + port);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = router;