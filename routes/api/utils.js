const UTILS = {
  handleKnownErrors: function (req, res, type, error) {
    if ("SequelizeValidationError" == error.name) {
      res
        .status(400)
        .json(`Error: received invalid data: ${error.errors[0].message}`);
      return true;
    } else if ("SequelizeUniqueConstraintError" == error.name) {
      console.log(error);
      res
        .status(400)
        .json(
          `Error: when attempting to create ${type}: [${req.body.category_name}]. A ${type} with that ${error.errors[0].path} already exists`
        );
      return true;
    }
  },
};
module.exports = UTILS;
