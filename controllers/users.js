const User = require("../models/user");
const { httpError, ctrlWrapper, formattedDate, sendEmail } = require("../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const {nanoid} = require("nanoid");
const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");

require("dotenv").config();
const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw httpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blanc" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(201).json({ user: { email, subscription: newUser.subscription } });
};

const verifyMail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw httpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({ message: "Verification successful" });
};


const resendVerifyMail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }
  if (user.verify) {
    throw httpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blanc" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(200).json({ message: "Verification email sent" });
};


const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw httpError(409, "Verify your mail first, please");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw httpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { token });
  res
  .status(200)
  .json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res
  .status(200)
  .json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const renewalSubscription = async (req, res) => {
  const { id } = req.user;
  const { subscription } = req.body;
  console.log("subscription", subscription);
  const result = await User.findByIdAndUpdate(
    id,
    { subscription },
    { new: true, select: "-_id email subscription" }
  );

  if (!result) {
    throw httpError(404, "Not Found");
  }
  res.status(200).json(result);
};

const avatarDir = path.join(__dirname, "..", "public", "avatars");

const updateAvatar = async (req, res) => {
  // console.log('req.user', req.user)
  // console.log('req.file in updateAvatar', req.file)
  const { email, _id } = req.user;
  const { path: tempPath, originalname } = req.file;

  const userName = email.substring(0, email.indexOf("@"));
  const originalExtension = path.extname(originalname);

  const fileName = `${userName}_${formattedDate}${originalExtension}`;

  const resultPath = path.join(avatarDir, fileName);

  Jimp.read(tempPath)
    .then((img) => img.resize(250, 250).write(resultPath))
    .then(async () => {
      await fs.unlink(tempPath);
      const avatarURL = path.join("avatars", fileName);
      await User.findByIdAndUpdate(_id, { avatarURL });
      res.status(200).json({ avatarURL });
    });
};



module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  renewalSubscription: ctrlWrapper(renewalSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyMail: ctrlWrapper(verifyMail),
  resendVerifyMail: ctrlWrapper(resendVerifyMail),
};
