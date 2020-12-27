const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/express-auth", {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// 定义数据模型
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },

  // 使用bcrypt加密密码（散列，不可逆，且每次加密不一样）
  password: {
    type: String,
    // 自定义setter
    set(val) {
      return require("bcrypt").hashSync(val, 10); //10 散列的强度 
    },
  },
});

// 创建模型实例
const User = mongoose.model("User", userSchema);

// 删除集合
// User.db.dropCollection("users");

module.exports = {
  User,
};
