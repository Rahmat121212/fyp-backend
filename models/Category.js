const mongoose = require("mongoose");
const catgorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("categorie", catgorySchema);
