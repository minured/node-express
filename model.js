const mongoose = require("mongoose");

// 连接mongodb，并创建名为express-auth的数据库，
// 即时数据库不存在，也会自动创建
mongoose.connect("mongodb://localhost:27017/express-auth", {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: true
});

// 定义数据模型
// Schema 是mongoose的工具，把数据映射到集合（集合是相当于mysql的表）

// 注册登录
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

// 视频信息模型
const videoInfoSchema = new mongoose.Schema({
  videoID: { type: String },
  title: { type: String },
  playUrl: { type: String },
  playVolume: { type: Number },
  previewImg: { type: String },
  recommend: { type: Array },
  comment: { type: Array },
});

// 用户收藏点赞
const videoUserInfo = mongoose.Schema({
  username: { type: String },
  videoID: { type: String },
  isCollect: { type: Boolean },
});

// 个人信息
const userInfoSchema = mongoose.Schema({
  username: { type: String },
  nickname: { type: String },
  avatar: { type: String },
  signature: { type: String },
  gender: { type: Number },
  username: { type: String },
});

// 创建模型实例
const User = mongoose.model("User", userSchema);

// 删除集合
// User.db.dropCollection("users");

module.exports = {
  User,
};
