const validator = require("validator");

// 1. Validator Function
const valid = (data) => {
  const mandatoryFields = ["firstName", "emailId", "password"];
  const isAllowed = mandatoryFields.every((field) =>
    Object.keys(data).includes(field)
  );

  if (!isAllowed) {
    throw new Error("Missing Required Fields (firstName, emailId, password)");
  }
  if (!validator.isEmail(data.emailId)) {
    throw new Error("Invalid Email Format");
  }
};



module.exports = valid;
