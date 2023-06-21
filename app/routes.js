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
  // Your checkout code...
});

router.post('/posts', posts.createPost);
router.get('/posts', posts.getAllPosts);
router.get('/posts/:id', posts.getPostById);
router.put('/posts/:id', posts.updatePost);
router.delete('/posts/:id', posts.deletePost);

router.post('/send_email', async (req, res) => {
  // Your send_email code...
});

router.post('/execute_transaction', (req, res) => {
  // Your execute_transaction code...
});

router.post('/save_user_information', async (req, res) => {
  // Your save_user_information code...
});

// Use the router
app.use(router);

// Start the server
const port = process.env.PORT || 19000; 
app.listen(port, function () {
  console.log('Express server is up and running on port ' + port);
});

module.exports = router;
