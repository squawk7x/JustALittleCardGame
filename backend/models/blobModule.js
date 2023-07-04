const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blobSchema = new Schema(
  {
    player_list: {
      type: Array,
      required: true,
    },
    cards_played: {
      type: Array,
      required: true,
    },
    bridge_monitor: {
      type: Array,
      required: true,
    },
    blind: {
      type: Array,
      required: true,
    },
    stack: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blob', blobSchema);
