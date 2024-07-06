const router = require("express").Router();
const utils = require("./utils.js");
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint
const type = "Tag";
const typePlural = "Tags";
const TheType = Tag;

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

// create a new tag
router.post("/", async (req, res) => {
  const keyValue = req.body.tag_name;
  try {
    const typeData = await TheType.create({
      tag_name: keyValue,
    });
    if (!typeData)
      throw new error(
        `Failure when attempting to create ${type} [${keyValue}]`
      );
    else res.status(200).json(typeData);
  } catch (error) {
    if (!utils.handleKnownErrors(req, res, type, keyValue, error))
      //unknown error
      res
        .status(500)
        .json(
          `Failure when attempting to create ${type} [${keyValue}]: ${error.message} ${error}`
        );
  }
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
  const scope = "update by ID";
  res.json(`${req.method} ${scope} ${type}`);
});

// delete a tag by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const typeData = await TheType.destroy({
      where: { id: req.params.id },
    });
    if (!typeData)
      res.status(404).json(`No ${type} esists with id [${req.params.id}]`);
    else res.status(200).json(typeData);
  } catch (error) {
    if (!utils.handleKnownErrors(req, res, type, null, error))
      res.status(500).json(error);
    console.log(`Error when deleting ${type}: ${error.name}
      ${error}`);
  }
});

module.exports = router;
