const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const register = async (req, res) => {
  const { email, password } = req.body;

  // Hash the password using bcrypt before storing it in the database
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    // Insert the user's email and hashed password into the database
    await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [email, hashedPassword]
    );

    res.status(201).send('User created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database for the user's email and password hash
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: 'Authentication failed',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Authentication failed',
      });
    }

    // Sign a JWT token using the user's ID as the payload
    const token = jwt.sign({ userId: user.id }, 'mysecretkey', { expiresIn: '1h' });

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: user.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  register,
  login
};