const express = require("express");
const { User } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { PRIVATE_KEY } = require("./private");

const app = express();
// express
app.use(express.json());

app.get("/api", async (req, res) => {
  res.send("node server api");
});

app.get("/api/users", async (req, res) => {
  const userList = await User.find();
  res.send(userList);
});
app.post("/api/register", async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
  });
  console.log(user);
  res.send(user);
});
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
  });
  if (!user) {
    return res.status(422).send({
      message: "用户不存在",
    });
  }
  const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!isPasswordValid) {
    return res.status(422).send({
      message: "密码不正确",
    });
  }

  // 生成token
  const token = jwt.sign(
    {
      id: user._id,
    },
    PRIVATE_KEY
  );
  console.log(token);

  res.send({
    message: "登陆成功",
    token,
  });
});

app.listen(1234, () => {
  console.log(`server on http://localhost:1234`);
});
