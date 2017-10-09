const router = require("express").Router();
const User = require("../models/User");
const FileUploader = require("../util/upload");
const wrapper = require("../util/errorWrappers").expressWrapper;
const uploadMw = FileUploader.single("photo");

// Authentication Middleware
const allowed = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.json({ error: "unauthorized user action" });
  }
};

// Route Handlers
const getUsers = async (req, res) => {
  res.json(await User.find({ public: true }));
};

const getUser = async (req, res) => {
  const { id } = req.params;
  res.json(await User.findOne({ _id: id }));
};

const updateUser = async (req, res) => {
  const user = req.body;
  const updated = await User.updateUser(user, req.session.user._id);
  if (!updated.errors) {
    req.session.user = updated;
  }
  res.json(updated);
};

const removeUser = async (req, res) => {
  const user = await User.remove({ _id: this.session.user._id });
  req.session.user.remove();
  req.logout();
  res.json(user);
};

const addPicture = async (req, res) => {
  const file = {
    data: req.file.buffer,
    name: req.file.originalname,
    mimetype: req.file.mimetype
  };
  const pictured = {
    kind: "User",
    item: req.session.user._id
  };
  const picture = await FileUploader.upload(file, pictured);

  // req.session.user.update({ profilePicture: picture }); // TODO: fix this
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.session.user._id },
    { $set: { profilePicture: picture.url } },
    { new: true }
  );

  req.session.user = updatedUser;

  res.json(picture.url);
};

const removePicture = async (req, res) => {
  const picture = Picture.findById(req.session.user.profilePicture);
  await FileUploader.remove(picture.key);
  res.json({ deleted: picture });
};

// Register Route Handlers
router.get("/", wrapper(getUsers));
router.get("/:id", wrapper(getUser));
router.patch("/:id", allowed, wrapper(updateUser));
router.delete("/:id", allowed, wrapper(removeUser));
router.post("/picture", allowed, uploadMw, wrapper(addPicture));
router.delete("/picture", allowed, wrapper(removePicture));

module.exports = router;
