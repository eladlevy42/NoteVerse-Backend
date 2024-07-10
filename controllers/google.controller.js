const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const { login } = require("./auth.controller");

const SALT_ROUNDS = 10;
const { JWT_SECRET } = process.env;

async function signWithGoogle(req, res) {
  const { credentialDecoded, username } = req;

  if (!credentialDecoded)
    return res.status(500).json({ error: "Authentication with Google failed" });
  const {
    email,
    given_name: firstName,
    family_name: lastName,
  } = credentialDecoded;

  try {
    let user = req.user;
    //if user exists, go straignt to the login.
    if (!user) {
      // if user does not exist, register them with random password - won't needed because login will be with google. password is only for the scheme.
      const hashedPassword = await bcryptjs.hash(
        Math.random().toString(36).slice(-8),
        SALT_ROUNDS
      );

      user = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      });

      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "5h",
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Authentication with Google failed" });
  }
}

module.exports = { signWithGoogle };
