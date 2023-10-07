import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import imagesModel from "./models/imagesModel.mjs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.set("strictQuery", true);

mongoose
  .connect(
    "mongodb+srv://sameery020:ccGwaSpnhD4C93Cc@cluster0.5gv0b9m.mongodb.net/sop?retryWrites=true&w=majority",
    // "mongodb://localhost:27017/sop",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.put("/sop", async (req, res) => {
      try {
        const { project, language, images } = req.body;
        const doc = await imagesModel.findOne({ project, language });

        if (doc) {
          doc.images = images;
          await doc.save();
        } else {
          const newDoc = new imagesModel({
            project,
            language,
            images,
          });
          await newDoc.save();
          res.status(200).json({ message: "Successfully uploaded" });
          console.log("Successfully uploaded");
        }
      } catch (error) {
        console.error("Error saving/updating image:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    app.get("/sop/:project/:language", async (req, res) => {
      try {
        const { project, language } = req.params;
        const docs = await imagesModel
          .findOne({ project, language })
          .select("images");

        if (docs.length === 0) {
          // No documents found
          res.status(404).json({ message: "No documents found" });
        } else {
          // Documents found
          res.json(docs);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    app.listen(9000, () => {
      console.log(`BE started at port 9000`);
    });
  })
  .catch((err) => console.log("Error connecting to MongoDB Atlas:", err));
