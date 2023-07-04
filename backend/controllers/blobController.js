const Blob = require('../models/blobModule');

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

module.exports = {
  createBlob,
};
