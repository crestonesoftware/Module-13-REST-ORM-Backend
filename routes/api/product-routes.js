const router = require("express").Router();
const utils = require("./utils.js");
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

const type = "Product";
const typePlural = "Products";
const TheType = Product;

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

// get one product by ID
router.get("/:id", async (req, res) => {
  // TODO be sure to include its associated Category and Tag data
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

// create new product
router.post("/", async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      category_id: 1
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const product = await Product.create(req.body);
    // no product tags. Just respond
    if (!req.body.tagIds.length) {
      res.status(200).json(product);
      return;
    }
    // product tags are provided. Create pairings to bulk create in the ProductTag model
    const productTagIdArr = await req.body.tagIds.map((tag_id) => {
      return {
        product_id: product.id,
        tag_id,
      };
    });
    const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
    res.status(200).json(productTagIds);
  } catch (error) {
    if (!utils.handleKnownErrors(req, res, type, req.body.product_name, error))
      //unknown error
      res
        .status(500)
        .json(
          `Failure when attempting to create ${type} [${req.body.category_name}]: ${error.message} ${error}`
        );
  }
});

// update product
router.put("/:id", (req, res) => {
  // update product data
  const scope = "update by id";
  res.json(`${req.method} ${scope} ${type}`);
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
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
