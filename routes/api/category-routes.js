const router = require("express").Router();
const utils = require("./utils.js");
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint
const type = "Category";
const typePlural = "Categories";
const TheType = Category;

// find all
router.get("/", async (req, res) => {
  try {
    const typeData = await TheType.findAll();
    res.status(200).json(typeData);
  } catch (error) {
    console.log(`Error when getting ${typePlural}: ${error.name}`);
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  // find one by its `id` value
  try {
    const typeData = await TheType.findByPk(req.params.id);
    if (!typeData)
      res.status(404).json(`No ${type} esists with id [${req.params.id}]`);
    else res.status(200).json(typeData);
    // be sure to include its associated Products
    // TODO include products
  } catch (error) {
    console.log(`Error when getting ${typePlural}: ${error.name}
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
        `Failure when attempting to create ${type} [${req.body.category_name}]`
      );
    else res.status(200).json(category);
  } catch (error) {
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
  // updates by `id` value
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

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const category = await Category.destroy({
      where: { id: req.params.id },
    });
    if (!category)
      res.status(404).json(`No ${type} esists with id [${req.params.id}]`);
    else res.status(200).json(category);
  } catch (error) {
    if (!utils.handleKnownErrors(req, res, type, error))
      res.status(500).json(error);
    console.log(`Error when deleting ${type}: ${error.name}
      ${error}`);
  }
});

module.exports = router;
