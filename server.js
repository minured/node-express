const express = require("express");
const { User } = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("./private");

// TODO 错误处理

const app = express();
app.use(express.json());

// express中间件(函数), 路由的每个回调其实都是中间件
const authUser = async (req, res, next) => {
  const reqToken = String(req.headers.authorization).split(" ").pop();
  const { id } = jwt.verify(reqToken, PRIVATE_KEY);
  // 挂到req上，让下一个中间件访问
  req.user = await User.findById(id);

  next();
};

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
  // 把数据库_id传进去，作为个人唯一标识，用于解密识别身份
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
app.get("/api/profile", authUser, async (req, res) => {
  res.send(req.user);
});

// 查询用户订单
// app.get("/api/order", authUser, async (req, res) => {
//   const order = Order.find().where({
//     user: req.user._id,
//   });
// });

app.listen(1234, () => {
  console.log(`server on http://localhost:1234`);
});
