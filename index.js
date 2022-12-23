const express = require("express");
const app = express();
const connection = require("./config/db");
const { isEmpty, isUnique } = require("./validator/validate");

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

  connection.query("SELECT * FROM students", function (err, result) {
    if (err) {
      return next(err);
    }

    let uniqueFields = [
      { colName: "roll", value: roll },
      { colName: "name", value: name },
    ];

    isUnique(result, uniqueFields, errArray);

    if (errArray.length) {
      return res.json({
        success: false,
        error: errArray,
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

app.use((err, req, res) => {
  console.log(err.message);

  res.json({
    success: false,
    error: ["Something went wrong!"],
  });
});

app.listen(9000, () => {
  console.log("server is running");
});
