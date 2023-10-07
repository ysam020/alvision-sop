import mongoose from "mongoose";

const imagesModel = new mongoose.Schema({
  project: { type: String },
  language: { type: String },
  images: [{ type: String }],
});

export default mongoose.model("images", imagesModel);
