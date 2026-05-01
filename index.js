import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
dotenv.config()
const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});