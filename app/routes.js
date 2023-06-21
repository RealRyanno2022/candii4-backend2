// Module imports
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const auth = require('./auth');
const braintree = require('./braintree');
const email = require('./email');
const posts = require('./posts');
const { getClientToken, processPayment } = require('./braintree.js');
const sendEmail = require('./sendEmail');
const admin = require('firebase-admin');
const serviceAccount = require('./candii-a8618-firebase-adminsdk-ssavy-7006eb0d3a.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Setup Express app and middleware
const app = express();
app.use(cors());
app.use(morgan('combined'));

// Initialize router
const router = express.Router();

// Routes
router.get('/', (req, res) => {
  res.send('Server running');
});

router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/client_token', getClientToken);
router.post('/checkout', async (req, res) => {
  console.log('Request body:', req.body);
  
  const { paymentMethodNonce, amount, productId, userId } = req.body;

  gateway.transaction.sale({
    amount,
    paymentMethodNonce,
    options: {
      submitForSettlement: true,
    },
  }, async (err, result) => {
    if (err || !result.success) {
      console.error('Error:', err || 'Payment error');
      res.status(500).send(err || 'Payment error');
    } else {
      // Payment is successful, now we add this product to user's purchase history
      try {
        const userRef = db.collection('users').doc(userId);
        await userRef.update({
          purchases: admin.firestore.FieldValue.arrayUnion(productId)
        });
        res.send('Payment successful');
      } catch (err) {
        console.error('Error updating user purchases:', err);
        res.status(500).send('Error updating user purchases');
      }
    }
  });
});

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

router.post('/execute_transaction', (req, res) => {
  const { paymentMethodNonce, amount } = req.body;

  gateway.transaction.sale(
    {
      amount,
      paymentMethodNonce,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err || !result.success) {
        res.status(500).send(err || 'Payment error');
      } else {
        res.send('Payment successful');
      }
    }
  );
});

router.post('/save_user_information', async (req, res) => {
  const { state, country, email, address, phoneNumber, postCode, firstName, lastName } = req.body;

  try {
    const docRef = db.collection('users').doc(); // You can replace 'users' with your own collection name

    await docRef.set({
      state, 
      country, 
      email, 
      address, 
      phoneNumber, 
      postCode, 
      firstName, 
      lastName
    });

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

module.exports = router;
