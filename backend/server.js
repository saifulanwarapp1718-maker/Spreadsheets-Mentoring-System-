import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import perangkatProvinsiRoutes from './routes/perangkatProvinsiRoutes.js';
import bapRoutes from './routes/bapRoutes.js'; 
import monitoringProvinsiRoutes from './routes/monitoringProvinsiRoutes.js';

dotenv.config();
const app = express();

app.use(cors()); 
app.use(express.json()); 


// --- RUTE LOGIN GLOBAL ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const validUser = process.env.ADMIN_USER || 'admin';
  const validPass = process.env.ADMIN_PASS || 'admin123';

  if (username === validUser && password === validPass) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ success: true, token, user: { username, role: 'Administrator' } });
  } else {
    res.status(401).json({ success: false, message: 'Username atau password salah!' });
  }
});

// --- ROUTER SPREADSHEET BAP ---
app.use('/api/bap', bapRoutes);
app.use('/api/monitoring/provinsi', monitoringProvinsiRoutes);
app.use('/api/perangkat/provinsi',perangkatProvinsiRoutes);

app.get('/', (req, res) => {
  res.send('Server Backend BASTP berjalan dengan baik di Vercel 🚀');
});

// Listener hanya untuk development lokal di komputer kamu
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  });
}

// WAJIB UNTUK VERCEL (Jangan sampai baris ini terhapus)
export default app;