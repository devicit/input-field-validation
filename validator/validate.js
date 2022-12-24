const connection = require("../config/db");

const isEmpty = (field, value, errArray) => {
  if (!value.trim()) {
    let errObj = {
      field: field,
      message: `${field[0].toUpperCase() + field.slice(1)} is required!`,
    };

    errArray.push(errObj);
  }
};

const checkIfAlreadyExist = (tableName, uniqueFields, cb) => {
  connection.query(`SELECT * FROM ${tableName}`, function (err, dataArr) {
    if (err) {
      return cb({ status: 500, error: err });
    }

    const errArray = [];

    function createObjAndPush(field) {
      let errObj = {
        field: field.colName,
        message: `${
          field.colName[0].toUpperCase() + field.colName.slice(1)
        }: ${field.value.trim()} already exist!`,
      };

      errArray.push(errObj);
    }

    uniqueFields.forEach((field) => {
      for (let i = 0; i < dataArr.length; i++) {
        let colValue = dataArr[i][field.colName];

        if (typeof colValue == "string") {
          if (
            colValue.toLowerCase().trim() == field.value.toLowerCase().trim()
          ) {
            createObjAndPush(field);
            break;
          }
        } else {
          if (colValue == field.value) {
            createObjAndPush(field);
            break;
          }
        }
      }
    });

    if (errArray.length) {
      cb({ status: 400, errArray });
    } else {
      cb({ status: 200 });
    }
  });
};

module.exports = { isEmpty, checkIfAlreadyExist };
