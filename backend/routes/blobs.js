const express = require('express');
const { createBlob } = require('../controllers/blobController');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ msg: 'GET' });
});

router.get('/:id', (req, res) => {
  res.json({ msg: 'GET a single id' });
});

router.post('/', createBlob);

router.delete('/', (req, res) => {
  res.json({ msg: 'DELETE a single id' });
});

router.delete('/:id', (req, res) => {
  res.json({ msg: 'DELETE a single id' });
});

router.patch('/:id', (req, res) => {
  res.json({ msg: 'PATCH a single id' });
});

module.exports = router;
