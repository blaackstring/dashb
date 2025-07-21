import express from 'express';
import dotenv from 'dotenv';
import DbConnetion from './config/DbConnetion.js';
import router from './routes/homeRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
DbConnetion();

const frontendpath = path.join(__dirname, '../frontend/dist');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(frontendpath));

// API routes
app.use('/api/v1', router);

// Wildcard route for SPA
app.get('/{*any}', (req, res) => {
  res.sendFile('index.html', { root: frontendpath });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
