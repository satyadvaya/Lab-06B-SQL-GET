const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/categories', async(req, res) => {

  try {
    const data = await client.query('SELECT * from categories;');
    
    res.json(data.rows);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/soups', async(req, res) => {

  try {
    const data = await client.query(
      `SELECT
        soups.id,
        soups.name,
        soups.seasonal,
        soups.tastiness,
        categories.name AS category
      FROM soups INNER JOIN categories
      ON soups.category_id = categories.id
      ORDER BY soups.id;`
    );
    
    res.json(data.rows);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/soups/:id', async(req, res) => {

  const id = req.params.id;

  try {
    const data = await client.query(
      `SELECT
        soups.id,
        soups.name,
        soups.seasonal,
        soups.tastiness,
        categories.name AS category
      FROM soups INNER JOIN categories
      ON soups.category_id = categories.id
      WHERE soups.id = $1;
      `, [id]);

    res.json(data.rows[0]);

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/soups', async(req, res) => {

  try {
    const data = await client.query(`
    INSERT INTO soups(
      name,
      category_id,
      seasonal,
      tastiness
    ) VALUES ($1, $2, $3, $4)
    RETURNING *;`, [
      req.body.name,
      req.body.category_id,
      req.body.seasonal,
      req.body.tastiness
    ]);

    res.json(data.rows[0]);
    
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});


app.put('/soups/:id', async(req, res) => {

  try {
    const data = await client.query(`
      UPDATE soups
      SET 
        name=$2,
        category_id=$3,
        seasonal=$4,
        tastiness=$5
      WHERE id = $1
      RETURNING *;`, [
      req.params.id,
      req.body.name,
      req.body.category_id,
      req.body.seasonal,
      req.body.tastiness
    ]);

    res.json(data.rows[0]);
    
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;