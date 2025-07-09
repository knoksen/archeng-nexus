const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.post('/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.json({ message: 'Received' });
});

app.listen(port, () => {
  console.log(`Example server listening on port ${port}`);
});
