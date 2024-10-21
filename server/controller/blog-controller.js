
const mongoose = require("mongoose");
const Blog = require("../model/Blog");
const User = require("../model/User");

// Get all blogs
const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find().populate('user'); // Also populate user details if needed
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error fetching blogs" });
  }

  if (!blogs || blogs.length === 0) {
    return res.status(404).json({ message: "No blogs found" });
  }

  return res.status(200).json({ blogs });
};

// Add a new blog
const addBlog = async (req, res, next) => {
    console.log("Add Blog function hit");
  const { title, desc, img, user } = req.body;
  const currentDate = new Date();

  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error fetching user" });
  }

  if (!existingUser) {
    return res.status(400).json({ message: "Unauthorized: User does not exist" });
  }

  const blog = new Blog({
    title,
    desc,
    img,
    user,
    date: currentDate,
  });

//   try {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     await blog.save({ session }); // Save blog in session
//     existingUser.blogs.push(blog); // Add blog to user's blogs array
//     await existingUser.save({ session }); // Save user with updated blog list
//     await session.commitTransaction(); // Commit transaction
//     session.endSession();
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Error saving blog" });
//   }

//   return res.status(200).json({ blog });
// };
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save(session);
    console.log("Blog saved:", blog);  // Added log
    existingUser.blogs.push(blog);
    await existingUser.save(session);
    await session.commitTransaction();
    console.log("Transaction committed and user updated:", existingUser);  // Added log
  } catch (err) {
    console.log("Error during transaction:", err);  // Added log
    return res.status(500).json({ message: err });
  }
};


// // Update blog by ID
// const updateBlog = async (req, res, next) => {
//   const blogId = req.params.id;
//   const { title, desc } = req.body;

//   let blog;
//   try {
//     blog = await Blog.findByIdAndUpdate(blogId, { title, desc }, { new: true }); // Return updated document
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ message: "Unable to update blog" });
//   }

//   if (!blog) {
//     return res.status(404).json({ message: "Blog not found" });
//   }

//   return res.status(200).json({ blog });
// };

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, desc } = req.body;

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(id, { title, desc }, { new: true });
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update the blog' });
    }
};


// Get blog by ID
const getById = async (req, res, next) => {
  const id = req.params.id;
  let blog;

  try {
    blog = await Blog.findById(id).populate('user'); // Populate user data for blog
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error fetching blog" });
  }

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  return res.status(200).json({ blog });
};

// Delete blog by ID
const deleteBlog = async (req, res, next) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findByIdAndRemove(id).populate("user");
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Remove the blog reference from the user's blog array
    const user = blog.user;
    user.blogs.pull(blog);
    await user.save();

    return res.status(200).json({ message: "Successfully deleted blog" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Unable to delete blog" });
  }
};

// Get blogs by user ID
const getByUserId = async (req, res, next) => {
  const userId = req.params.id;

  let userWithBlogs;
  try {
    // Populate the user's blogs field
    userWithBlogs = await User.findById(userId).populate("blogs");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching blogs" });
  }

  if (!userWithBlogs || userWithBlogs.blogs.length === 0) {
    return res.status(404).json({ message: "No blogs found for this user" });
  }

  return res.status(200).json({ user: userWithBlogs });
};

module.exports = {
  getAllBlogs,
  addBlog,
  updateBlog,
  getById,
  deleteBlog,
  getByUserId,
};
