const router = require("express").Router();
const User = require("../models/User");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: cryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECURE
    ).toString(),
  });
  try {
    const saveUser = await newUser.save();
    res.status(200).json(saveUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Credenciales equivocadas");

    const hashedPassword = cryptoJs.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECURE
    );
    const OriginalPassword = hashedPassword.toString(cryptoJs.enc.Utf8);
    OriginalPassword != req.body.password &&
      res.status(401).json("Credenciales erroneas");

    const tokenAccess = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "2d" }
    );
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, tokenAccess });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
