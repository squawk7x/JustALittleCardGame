require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const blobsRoutes = require('./routes/blobs');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/blobs', blobsRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
