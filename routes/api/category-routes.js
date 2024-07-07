const router = require("express").Router();
const utils = require("./utils.js");
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint
const type = "Category";
const typePlural = "Categories";
const TheType = Category;

// UTILITY FUNCTIONS

// gets the Products associated to a Category by Category ID
async function getProductsInCategory(categoryID) {
  const productsInCategory = await Product.findAll({
    where: {
      category_id: categoryID,
    },
    attributes: { include: "id" },
  });

  return productsInCategory;
}

// adds the associated products into the Category JSON object
async function addAssociatedProducts(typeData) {
  const productsInCategory = await getProductsInCategory(
    typeData.getDataValue("id")
  );
  typeData.setDataValue("products", productsInCategory);
}

// API ROUTES

// get all Categories
router.get("/", async (req, res) => {
  try {
    const typeData = await TheType.findAll();
    // add the Products in this Category
    for (let ii = 0; ii < typeData.length; ii++)
      await addAssociatedProducts(typeData[ii]);

    res.status(200).json(typeData);
  } catch (error) {
    // the only likely error scenario here is a server problem
    console.log(`Error when getting ${typePlural}: ${error.name}`);
    console.log(error);
    res.status(500).json(error);
  }
});

// get a Category by its id value, including the associated Product records
router.get("/:id", async (req, res) => {
  try {
    const typeData = await TheType.findByPk(req.params.id);

    if (!typeData)
      res.status(404).json(`No ${type} esists with id [${req.params.id}]`);
    else {
      await addAssociatedProducts(typeData);

      res.status(200).json(typeData);
    }
  } catch (error) {
    console.log(`Error when getting ${typePlural}: ${error.name}
      ${error}`);
    res.status(500).json(error);
  }
});

// create a new category
router.post("/", async (req, res) => {
  try {
    const typeData = await TheType.create({
      category_name: req.body.category_name,
    });
    if (!typeData)
      throw new error(
        `Failure when attempting to create ${type} [${req.body.category_name}]`
      );
    else res.status(200).json(typeData);
  } catch (error) {
    if (!utils.handleKnownErrors(req, res, type, req.body.category_name, error))
      //unknown error
      res
        .status(500)
        .json(
          `Failure when attempting to create ${type} [${req.body.category_name}]: ${error.message} ${error}`
        );
  }
});

// updates category_name for a category
router.put("/:id", async (req, res) => {
  try {
    const typeData = await TheType.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json(typeData);
  } catch (error) {
    if (!utils.handleKnownErrors(req, res, type, req.body.category_name, error))
      res.status(500).json(error);
    console.log(`Error when updating ${type}: ${error.name}
      ${error}`);
  }
});

// delete a category by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const typeData = await TheType.destroy({
      where: { id: req.params.id },
    });
    if (!typeData)
      res.status(404).json(`No ${type} esists with id [${req.params.id}]`);
    else res.status(200).json(typeData);
  } catch (error) {
    if (!utils.handleKnownErrors(req, res, type, req.body.category_name, error))
      res.status(500).json(error);
    console.log(`Error when deleting ${type}: ${error.name}
      ${error}`);
  }
});

module.exports = router;
