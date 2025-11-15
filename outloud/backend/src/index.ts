import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'outloud-backend' });
});

// Routes will go here -later
// app.use('/auth', authRoutes);
// app.use('/conversations', conversationRoutes);

app.listen(PORT, () => {
  console.log(`Outloud Backend running on port ${PORT}`);
});