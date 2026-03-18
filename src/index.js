const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.get('/api/info', (req, res) => {
  res.json({
    app: 'Demo Web App',
    stack: 'Node.js + Express',
    containerized: process.env.CONTAINERIZED === 'true',
    environment: process.env.NODE_ENV || 'development'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

module.exports = app;
