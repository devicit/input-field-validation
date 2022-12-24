const express = require("express");
const app = express();
const connection = require("./config/db");
const { isEmpty, checkIfAlreadyExist } = require("./validator/validate");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/add-student", (req, res, next) => {
  let { name, roll } = req.body;
  let errArray = [];

  isEmpty("name", name, errArray);
  isEmpty("roll", roll, errArray);

  if (errArray.length) {
    return res.json({
      success: false,
      error: errArray,
    });
  }

  let uniqueFields = [
    { colName: "roll", value: roll },
    { colName: "name", value: name },
  ];

  checkIfAlreadyExist("students", uniqueFields, function (response) {
    if (response.status == 500) {
      return next(response.error);
    }

    if (response.status == 400) {
      return res.json({
        success: false,
        error: response.errArray,
      });
    }

    let sql = `INSERT INTO students (name, roll) VALUES ('${name}', '${roll}')`;
    connection.query(sql, function (err, result) {
      if (err) {
        return next(err);
      }

      if (result.affectedRows) {
        res.json({
          success: true,
        });
      } else {
        res.json({
          success: false,
          error: ["Something went wrong!"],
        });
      }
    });
  });
});

app.use((err, req, res, next) => {
  console.log(err);

  res.json({
    success: false,
    error: ["Something went wrong!"],
  });
});

app.listen(9000, () => {
  console.log("server is running");
});
