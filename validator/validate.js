const isEmpty = (field, value, errArray) => {
  if (!value.trim()) {
    let errObj = {
      field: field,
      message: `${field[0].toUpperCase() + field.slice(1)} is required!`,
    };

    errArray.push(errObj);
  }
};

const isUnique = (dataArr, uniqueFields, errArray) => {
  uniqueFields.forEach((field) => {
    for (let i = 0; i < dataArr.length; i++) {
      if (dataArr[i][field.colName] == field.value) {
        let errObj = {
          field: field.colName,
          message: `${
            field.colName[0].toUpperCase() + field.colName.slice(1)
          }: ${field.value} already exist!`,
        };

        errArray.push(errObj);
        break;
      }
    }
  });
};

module.exports = { isEmpty, isUnique };
