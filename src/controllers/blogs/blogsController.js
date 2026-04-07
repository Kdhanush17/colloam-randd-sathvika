const { Blog } = require("../../models");
const statusHelper = require("../../../helpers/statusHelper");
const AWS = require("aws-sdk");
const logger = require("../../../utils/winston");
const { gets3details } = require("../../controllers/lib/systemSettings");
const { Op } = require("sequelize");


// ==============================
// 🔹 GENERATE BLOG CODE
// ==============================
const generateblogCode = async () => {
  const date = new Date();
  const formattedDate = `${String(date.getDate()).padStart(2, "0")}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getFullYear()).slice(2)}`;
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BLOG-${formattedDate}-${random}`;
};


// ==============================
// 🔹 S3 HELPER
// ==============================
const uploadToS3 = async (file) => {
  let s3details = await gets3details();

  if (!s3details.status) throw new Error(s3details.errorMessage);

  const config = s3details.data;

  const s3 = new AWS.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
  });

  const ext = file.originalname.split(".").pop();
  const key = `blogs/blog-${Date.now()}.${ext}`;

  const upload = await s3.upload({
    Bucket: config.bucketname,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  }).promise();

  return upload.Location;
};


// ==============================
// ✅ CREATE BLOG
// ==============================
const blogCreation = async (req, res) => {
  try {
    let { blogName, blogSubject, blogDescription, external_link, blog_list } = req.body;

    // 🔹 Parse blog_list
    let parsedList = [];
    if (typeof blog_list === "string") {
      parsedList = JSON.parse(blog_list);
    } else if (Array.isArray(blog_list)) {
      parsedList = blog_list;
    }

    if (!req.file) {
      return statusHelper.ErrorResponse(res, "Blog thumbnail is required");
    }

    const thumbnailUrl = await uploadToS3(req.file);

    const newBlog = await Blog.create({
      blogCode: await generateblogCode(),
      blogName,
      blogSubject,
      blogDescription,
      blogThumbnail: thumbnailUrl,
      blog_list: parsedList,
      external_link,
      blogStatus: "ACTIVE"
    });

    return statusHelper.successResponse(res, "Blog Created", newBlog);

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in blog creation");
  }
};


// ==============================
// ✅ UPDATE BLOG
// ==============================
const blogUpdate = async (req, res) => {
  try {
    const { blogCode } = req.body;

    const blog = await Blog.findOne({ where: { blogCode } });

    if (!blog) {
      return statusHelper.ErrorResponse(res, "Blog not found");
    }

    let thumbnailUrl = blog.blogThumbnail;

    if (req.file) {
      thumbnailUrl = await uploadToS3(req.file);
    }

    let updatedList = blog.blog_list || [];

    if (req.body.blog_list) {
      updatedList = typeof req.body.blog_list === "string"
        ? JSON.parse(req.body.blog_list)
        : req.body.blog_list;
    }

    await Blog.update({
      blogName: req.body.blogName || blog.blogName,
      blogSubject: req.body.blogSubject || blog.blogSubject,
      blogDescription: req.body.blogDescription || blog.blogDescription,
      blogThumbnail: thumbnailUrl,
      blog_list: updatedList,
      external_link: req.body.external_link || blog.external_link,
      updated_date: new Date()
    }, {
      where: { blogCode }
    });

    const updated = await Blog.findOne({ where: { blogCode } });

    return statusHelper.successResponse(res, "Blog updated", updated);

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in blog update");
  }
};


// ==============================
// ✅ GET BLOGS
// ==============================
const blogRetrieve = async (req, res) => {
  try {
    const { blog_code } = req.query;

    let where = { blogStatus: "ACTIVE" };

    if (blog_code) {
      where.blogCode = blog_code;
    }

    const blogs = await Blog.findAll({
      where,
      order: [["created_date", "DESC"]]
    });

    return statusHelper.successResponse(
      res,
      blogs.length ? "Blogs retrieved" : "No blogs found",
      blogs
    );

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in blog retrieve");
  }
};


// ==============================
// ✅ DELETE BLOG (SOFT DELETE)
// ==============================
const blogDelete = async (req, res) => {
  try {
    const { blogCode } = req.query;

    const [updated] = await Blog.update(
      { blogStatus: "DEACTIVE" },
      { where: { blogCode } }
    );

    if (!updated) {
      return statusHelper.ErrorResponse(res, "Blog not found");
    }

    return statusHelper.successResponse(res, "Blog deleted");

  } catch (error) {
    logger.createLog(__filename, error.message, req);
    return logger.error(res, "Exception in blog delete");
  }
};


module.exports = {
  blogCreation,
  blogRetrieve,
  blogUpdate,
  blogDelete
};