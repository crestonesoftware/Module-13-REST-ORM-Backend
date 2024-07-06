const router = require("express").Router();
const utils = require("./utils.js");
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint
const type = "categories";

// find all categories
router.get("/", async (req, res) => {
  try {
    const categoryData = await Category.findAll();
    res.status(200).json(categoryData);
  } catch (error) {
    console.log(`Error when getting Categories: ${error.name}`);
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      res.status(404).json(`No Category esists with id [${req.params.id}]`);
    else res.status(200).json(category);
    // be sure to include its associated Products
    // TODO include products
  } catch (error) {
    console.log(`Error when getting Categories: ${error.name}
      ${error}`);
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  // create a new category
  const scope = "create new";
  //res.json(`${req.method} ${scope} ${type}`);
  try {
    const category = await Category.create({
      category_name: req.body.category_name,
    });
    if (!category)
      throw new error(
        `Failure when attempting to create Category [${req.body.category_name}]`
      );
    else res.status(200).json(category);
  } catch (error) {
    const type = "Category";
    if (!utils.handleKnownErrors(req, res, type, error))
      //unknown error
      res
        .status(500)
        .json(
          `Failure when attempting to create ${type} [${req.body.category_name}]: ${error.message} ${error}`
        );
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  const category = await Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: { id: req.params.id },
    }
  );
  res.status(200).json(category);
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
  const scope = "delete";
  res.json(`${req.method} ${scope} ${type}`);
});

module.exports = router;
