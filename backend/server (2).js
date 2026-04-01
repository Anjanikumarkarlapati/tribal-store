const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/products', require('./routes/products'));
app.use('/api/artisans', require('./routes/artisans'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/reviews', require('./routes/reviews'));

app.get('/', (req, res) => {
  res.json({ message: '🎨 Tribal API is running!', status: 'OK' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
