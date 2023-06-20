const pool = require('./db');

const createPost = async (req, res) => {
    const { title, content, authorId } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
        [title, content, authorId]
      );
      const newPost = result.rows[0];
      res.status(201).json(newPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };

  const getClientToken = async (req, res) => {
    try {
      const response = await gateway.clientToken.generate({});
      res.json({clientToken: response.clientToken});
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const processPayment = async (req, res) => {
    const { paymentMethodNonce, amount } = req.body;
    try {
      const result = await gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: paymentMethodNonce,
        options: {
          submitForSettlement: true
        }
      });
      if (result.success) {
        res.json({message: 'Transaction successful'});
      } else {
        res.status(500).json({ error: 'Transaction failed' });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const getAllPosts = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM posts');
      const posts = result.rows;
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };

  const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
      const post = result.rows[0];
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
      const result = await pool.query(
        'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
        [title, content, id]
      );
      const updatedPost = result.rows[0];
      if (updatedPost) {
        res.json(updatedPost);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
      const deletedPost = result.rows[0];
      if (deletedPost) {
        res.json(deletedPost);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  


  module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getClientToken,
    processPayment,
  };