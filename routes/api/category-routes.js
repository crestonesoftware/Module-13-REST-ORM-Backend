const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint
const type = "categories";

router.get("/", (req, res) => {
  // find all categories
  const scope = "all";
  res.json(`${req.method} ${scope} ${type}`);
  // be sure to include its associated Products
});

router.get("/:id", (req, res) => {
  // find one category by its `id` value
  const scope = "single by ID";
  res.json(`${req.method} ${scope} ${type}`);
  // be sure to include its associated Products
});

router.post("/", (req, res) => {
  // create a new category
  const scope = "create new";
  res.json(`${req.method} ${scope} ${type}`);
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  const scope = "update by ID";
  res.json(`${req.method} ${scope} ${type}`);
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
  const scope = "delete";
  res.json(`${req.method} ${scope} ${type}`);
});

module.exports = router;
