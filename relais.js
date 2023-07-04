const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let dbConnection;

const url =
  'mongodb+srv://squawk7x:Falcon7x@cluster0.2llkx6k.mongodb.net/?retryWrites=true&w=majority';
// const url = 'mongodb://localhost:27017/bridge'

function connectToDb(cb) {
  MongoClient.connect(url)
    .then((client) => {
      dbConnection = client.db();
      cb();
    })
    .catch((err) => {
      console.log(err);
      cb(err);
    });
}

let db;

connectToDb((err) => {
  if (!err) {
    app.listen(process.env.port || 3000, () => {
      console.log('listening on port 3000');
    });
    db = dbConnection;
  }
});

app.get('/blobs', (req, res) => {
  db.collection('blobs')
    .find()
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
  }
  else {
    db.collection('blobs')
      .findOne({}, { sort: { _id: -1 } })
      .then((lastEntry) => {
        if (lastEntry) {
          res.status(200).json(lastEntry);
        } else {
          res.status(404).json({ error: 'No entries found' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: 'Could not fetch the last entry' });
      });
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

app.delete('/blobs', (req, res) => {
  db.collection('blobs')
    .deleteMany({})
    .then((result) => {
      res.status(200).json({ message: 'All data deleted' });
    })
    .catch((err) => {
      res.status(500).json({ err: 'Could not delete data' });
    });
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
