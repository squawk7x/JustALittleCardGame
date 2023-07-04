const express = require('express');
const {
  createBlob,
  getBlobs,
  getBlob,
  deleteBlob,
  deleteAllBlobs,
  updateBlob,
} = require('../controllers/blobController');

const router = express.Router();

router.get('/', getBlobs);

router.get('/:id', getBlob);

router.post('/', createBlob);

router.delete('/', deleteAllBlobs);

router.delete('/:id', deleteBlob);

router.patch('/:id', updateBlob);

module.exports = router;
