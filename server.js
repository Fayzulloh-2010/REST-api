const express = require("express");
const cors = require("cors");
const fs = require("fs");
const PORT = 3000;
const multer = require("multer");
const upload = multer();
const crypto = require("crypto")

const app = express();

app.use(cors());
app.use(express.json());

const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"));

app.get("/users", (req, res) => {
  try {
    res.status(200).json({
      message: data,
    });
  } catch (err) {
    console.log(`err is found ${err}`);
  }
});

app.post("/users", upload.none(), (req, res) => {
  try {
    const { name, age, status } = req.body;
    const newUser = {
      id: crypto.randomUUID(),
      name: name,
      age: Number(age),
      status: status,
    };

    data.push(newUser);
    fs.writeFileSync("./data.json", JSON.stringify(data, null, 2), "utf-8");

    res.status(201).json({
      message: newUser,
    });
  } catch (err) {
    console.log(`err is found ${err}`);
  }
});

app.patch("/users/:id", upload.none(), (req, res) => {
  try {
    const editingUser = data.find((user) => user.id === req.params.id);
    if (editingUser) {
      const { name, age, status } = req.body;
      editingUser.name = name ?? editingUser.name;
      editingUser.age = Number(age) ?? editingUser.age;
      editingUser.status = status ?? editingUser.status;

      fs.writeFileSync("./data.json", JSON.stringify(data, null, 2), "utf-8");

      res.status(200).json({
        message: "succesfully edited",
        editingUser,
      });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    console.log(`err is found ${err}`);
  }
});

app.delete("/users/:id", upload.none(), (req, res) => {
  try {
    const deletingUser = data.find((user) => user.id === req.params.id);
    if (deletingUser) {
      const newData = data.filter((user) => {
        return user.id !== deletingUser.id;
      });

      fs.writeFileSync("./data.json", JSON.stringify(newData), "utf-8");

      res.status(200).json({ message: "Succesfully deleted", newData });
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    console.log(`err is found ${err}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
