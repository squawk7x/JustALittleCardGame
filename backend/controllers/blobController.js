const Blob = require('../models/blobModule');
const mongoose = require('mongoose');

const getBlobs = async (req, res) => {
  const blobs = await Blob.find({}).sort({ createAt: -1 });
  res.status(200).json(blobs);
};

const getBlob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such blob - Id not valid' });
  }
  const blob = await Blob.findById(id);

  if (!blob) {
    return res.status(404).json({ error: 'No such blob' });
  }
  res.status(200).json(blob);
};

const createBlob = async (req, res) => {
  const { player_list, cards_played, bridge_monitor, blind, stack } = req.body;
  try {
    const blob = await Blob.create({
      player_list,
      cards_played,
      bridge_monitor,
      blind,
      stack,
    });
    res.status(200).json(blob);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBlob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such blob - Id not valid' });
  }
  const blob = await Blob.findOneAndDelete({ _id: id });
  if (!blob) {
    return res.status(404).json({ error: 'No such blob' });
  }
  res.status(200).json(blob);
};

const deleteAllBlobs = async (req, res) => {
    try {
      const result = await Blob.deleteMany();
      res.status(200).json({ message: 'All blobs deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Could not delete blobs' });
    }
  };

const updateBlob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such blob - Id not valid' });
  }
  const blob = await Blob.findByIdAndUpdate({ _id: id }, { ...req.body });
  if (!blob) {
    return res.status(404).json({ error: 'No such blob' });
  }
  res.status(200).json(blob);
};

module.exports = {
  getBlob,
  getBlobs,
  createBlob,
  deleteBlob,
  deleteAllBlobs,
  updateBlob,
};
