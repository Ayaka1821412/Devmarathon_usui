const express = require('express');
const app = express();
const port = 5440;

app.get('/', (req, res) => {
  res.send('Hellooooooooooooooooooooooo!');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});