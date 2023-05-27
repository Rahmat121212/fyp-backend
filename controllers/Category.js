const { validationResult } = require("express-validator");
const formidable = require("formidable");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const CategoryModel = require("../models/Category");
class Category {
  async create(req, res) {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      console.log("fields--------->", fields);
      if (!err) {
        // const parsedData = JSON.parse(fields);
        const errors = [];
        if (errors.length === 0) {
          if (!files["image"]) {
            errors.push({ msg: "Image is required" });
          }
          if (errors.length === 0) {
            const images = {};

            const mimeType = files[`image`].mimetype;
            const extension = mimeType.split("/")[1].toLowerCase();
            if (
              extension === "jpeg" ||
              extension === "jpg" ||
              extension === "png"
            ) {
              const imageName = uuidv4() + `.${extension}`;
              const __dirname = path.resolve();
              const newPath =
                __dirname + `/../client/public/uploads/${imageName}`;
              images[`image`] = imageName;
              fs.copyFile(files[`image`].filepath, newPath, (err) => {
                if (err) {
                  console.log(err);
                }
              });
            } else {
              const error = {};
              error["msg"] = `image has invalid ${extension} type`;
              errors.push(error);
            }
            // }
            if (errors.length === 0) {
              try {
                const response = await CategoryModel.create({
                  name: fields.name,
                  image: images["image"],
                });
                return res
                  .status(201)
                  .json({ msg: "Category has created", response });
              } catch (error) {
                console.log(error);
                return res.status(500).json(error);
              }
            } else {
              return res.status(400).json({ errors });
            }
          } else {
            return res.status(400).json({ errors });
          }
        } else {
          return res.status(400).json({ errors });
        }
      }
    });
  }

  async categories(req, res) {
    const page = req.params.page;
    const perPage = 3;
    const skip = (page - 1) * perPage;

    try {
      const count = await CategoryModel.find({}).countDocuments();
      const response = await CategoryModel.find({})
        .skip(skip)
        .limit(perPage)
        .sort({ updatedAt: -1 });

      return res.status(200).json({ categories: response, perPage, count });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error!");
    }
  }

  async fetchCategory(req, res) {
    const { id } = req.params;

    try {
      const response = await CategoryModel.findOne({ _id: id });
      return res.status(200).json({ category: response });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error!");
    }
  }

  async updateCategory(req, res) {
    const { id } = req.params;
    const { name, image } = req.body;
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const exist = await CategoryModel.findOne({ name });

      if (!exist) {
        const response = await CategoryModel.updateOne(
          { _id: id },
          { $set: { name, image } }
        );
        return res
          .status(200)
          .json({ message: "Your category has been updated successfully!" });
      } else {
        return res
          .status(400)
          .json({ errors: [{ msg: `${name} category already exists` }] });
      }
    } else {
      return res.status(400).json({ errors: errors.array() });
    }
  }

  async deleteCategory(req, res) {
    const { id } = req.params;

    try {
      await CategoryModel.deleteOne({ _id: id });
      return res
        .status(200)
        .json({ message: "Category has been deleted successfully!" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error!");
    }
  }

  async allCategories(req, res) {
    try {
      const categories = await CategoryModel.find({});
      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json("Server internal error!");
    }
  }

  async randomCategories(req, res) {
    try {
      const categories = await CategoryModel.aggregate([
        { $sample: { size: 3 } },
      ]);
      return res.status(200).json({ categories });
    } catch (error) {
      return res.status(500).json("Server internal error!");
    }
  }
}

module.exports = new Category();
