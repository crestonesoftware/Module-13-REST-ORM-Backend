const UTILS = {
  handleKnownErrors: function (req, res, type, key, error) {
    console.log("***********************************************************");
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
          `Error: when attempting to create ${type}: [${key}]. A ${type} with that ${error.errors[0].path} already exists`
        );
      return true;
    } else if (error.name == "SequelizeForeignKeyConstraintError") {
      res
        .status(400)
        .json(
          `Foreign Key Constraint error when deleting ${type}: [${req.params.id}]. ${error.message}`
        );
      return true;
    }
  },
};
module.exports = UTILS;
