const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();
var {system_user_auth,unifiedAuthMiddleware} = require('../middleware/auth'); 
const BlogController = require("../src/controllers/blogs/blogsController"); 

router.post("/CreateBlog",upload.single('blogThumbnail'),unifiedAuthMiddleware,BlogController.blogCreation);
router.get("/GetBlogs",BlogController.blogRetrieve);
router.delete("/DeleteBlog",unifiedAuthMiddleware,BlogController.blogDelete);
router.put("/UpdateBlog",upload.single('blogThumbnail'),unifiedAuthMiddleware,BlogController.blogUpdate);


module.exports = router;