const express = require('express');
const router = require('./routes');
const { gateway } = require('./braintree');
const cors = require('cors'); 

const app = express();

const port = process.env.PORT || 19000;

app.use(cors('*'));

app.use(express.json());  // you only need one body-parsing middleware
app.use(router);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
