const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');

const app = express();
app.use(express.json());

// db Connection

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log('listening on port 3000');
    });
    db = getDb();
  }
});

// routes
app.get('/blobs', (req, res) => {
  // current page
  // const page = req.query.p || 0;
  // const blobsPerPage = 1;

  db.collection('blobs')
    .find()
    // .skip(page * blobsPerPage)
    // .limit(blobsPerPage)
    .toArray()
    .then((blobs) => {
      res.status(200).json(blobs);
    })
    .catch(() => {
      res.status(500).json('Could not fetch the document');
    });
});

app.get('/blobs/:_id', (req, res) => {
  if (ObjectId.isValid(req.params._id)) {
    db.collection('blobs')
      .findOne({ _id: new ObjectId(req.params._id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ err: 'Could not fetch the document' });
      });
  } else {
    res.status(500).json({ err: 'Not a valid id' });
  }
});

app.post('/blobs', (req, res) => {
  const blob = req.body;

  db.collection('blobs')
    .insertOne(blob)
    .then((result) => res.status(201).json(result))
    .catch((err) =>
      res.status(500).json({ err: 'Could not create the document' })
    );
});

app.delete('/blobs/:_id', (req, res) => {
  const id = req.params._id;

  if (ObjectId.isValid(id)) {
    db.collection('blobs')
      .deleteOne({ _id: new ObjectId(id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ err: 'Could not delete the document' });
      });
  } else {
    res.status(500).json({ err: 'Not a valid id' });
  }
});

app.patch('/blobs/:_id', (req, res) => {
  const updates = req.body;
  if (ObjectId.isValid(req.params._id)) {
    db.collection('blobs')
      .updateOne({ _id: new ObjectId(req.params._id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ err: 'Could not update the document' });
      });
  } else {
    res.status(500).json({ err: 'Not a valid id' });
  }
});
