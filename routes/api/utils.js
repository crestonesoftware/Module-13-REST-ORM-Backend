const UTILS = {
  // generically handles recognizable error conditions
  handleKnownErrors: function (req, res, type, key = null, error) {
    //
    let verb = "CREATE";
    if (req.method == "PUT") verb = "UPDATE";
    else if (req.method == "DELETE") verb = "DELETE";

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
          `Foreign Key Constraint error on attempt to ${verb} a ${type}: [${req.params.id}]. ${error.message}`
        );
      return true;
    }
  },
};
module.exports = UTILS;
