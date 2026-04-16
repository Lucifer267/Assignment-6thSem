import express from 'express';
import { createServer as createViteServer } from 'vite';
import jobsHandler from './api/jobs.js';

const app = express();
const PORT = 5173;

app.use(express.json());

// Create Vite server in middleware mode
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

// Wrap the serverless handler for Express
const wrapHandler = (handler) => async (req, res) => {
  await handler(req, res);
};

// API routes
app.get('/api/jobs', wrapHandler(jobsHandler));
app.post('/api/jobs', wrapHandler(jobsHandler));
app.put('/api/jobs', wrapHandler(jobsHandler));
app.delete('/api/jobs', wrapHandler(jobsHandler));
app.options('/api/jobs', wrapHandler(jobsHandler));

// Use Vite's connect instance as middleware
app.use(vite.middlewares);

// Serve SPA
app.use('*', (req, res) => {
  res.sendFile(new URL('./index.html', import.meta.url).pathname);
});

app.listen(PORT, () => {
  console.log(`🚀 JobFlow dev server running on http://localhost:${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api/jobs`);
});
