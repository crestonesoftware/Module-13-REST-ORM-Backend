const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint
const type = "Product";
const typePlural = "Products";
const TheType = Product;

// find all tags

// be sure to include its associated Product data
router.get("/", async (req, res) => {
  try {
    const typeData = await TheType.findAll();
    res.status(200).json(typeData);
  } catch (error) {
    console.log(`Error when getting ${typePlural}: ${error.name}`);
    res.status(500).json(error);
  }
});

// find a single tag by its `id`
// be sure to include its associated Product data
router.get("/:id", async (req, res) => {
  try {
    const typeData = await TheType.findByPk(req.params.id);
    if (!typeData)
      res.status(404).json(`No ${type} esists with id [${req.params.id}]`);
    else res.status(200).json(typeData);
  } catch (error) {
    console.log(`Error when getting ${typePlural}: ${error.name}
      ${error}`);
    res.status(500).json(error);
  }
});

router.post("/", (req, res) => {
  // create a new tag
  const scope = "create";
  res.json(`${req.method} ${scope} ${type}`);
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
  const scope = "update by ID";
  res.json(`${req.method} ${scope} ${type}`);
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
  const scope = "";
  res.json(`${req.method} ${scope} ${type}`);
});

module.exports = router;
