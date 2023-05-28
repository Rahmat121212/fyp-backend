const mongoose = require("mongoose");

const flexSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const Flex = mongoose.model("Flex", flexSchema);

module.exports = Flex;
