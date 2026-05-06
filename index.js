import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import { updateStatusCron } from './services/order.service.js';
dotenv.config()
const app = express();

const PORT = process.env.PORT;
// app.use(cors());
app.use(cors({
  origin: ['http://localhost:3000']
}));
app.use(express.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Run every 5 minutes
updateStatusCron();

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});