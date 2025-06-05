const { Router } = require("express");
const router = Router();
const path = require("path");
const fs = require("fs");
const Blog = require("../models/blog");
const multer = require("multer");
const Comment = require("../models/comment");

// Ensure uploads directory exists
const uploadDir = path.resolve("./public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  if (!req.user) return res.redirect("/user/signin");
  return res.render("addBlog", { user: req.user });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  if (!req.file) {
    return res.render("addBlog", {
      user: req.user,
      error: "Cover image is required.",
    });
  }
  const { title, body } = req.body;
  try {
    const blog = await Blog.create({
      body: body,
      coverImageUrl: `/uploads/${req.file.filename}`,
      createdBy: req.user._id,
      title: title,
    });
    return res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error(err);
    return res.render("addBlog", {
      user: req.user,
      error: "Failed to create blog. Please try again.",
    });
  }
});

router.get("/showAllBlog", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    return res.render("allBlogs", { user: req.user, blogs: allBlogs });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error fetching blogs");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");

    if (!blog) {
      return res
        .status(404)
        .render("404", { user: req.user, message: "Blog not found" });
    }

    const comments = await Comment.find({ blogId: req.params.id }).populate(
      "createdBy"
    );

    return res.render("blog", {
      user: req.user,
      blog,
      comments,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .render("404", { user: req.user, message: "Server error" });
  }
});

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  console.log(req);
  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
