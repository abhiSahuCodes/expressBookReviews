const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  // Find user with matching username and password
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return user !== undefined;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const token = jwt.sign(
      {
        username: username,
      },
      "access",
      {
        expiresIn: "1h",
      }
    );

    // Save token in session
    req.session.authorization = {
      accessToken: token,
    };

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  }

  return res.status(401).json({
    message: "Invalid username or password",
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: `The book with ISBN ${isbn} was not found`,
    });
  }

  // Check if review is provided
  if (!review) {
    return res.status(400).json({
      message: "Review is required",
    });
  }

  // Add review to book
  books[isbn].reviews[username] = review;

  // Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: `The book with ISBN ${isbn} was not found`,
    });
  }

  // Check if user has a review for this book
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "No review found for this book by the current user",
    });
  }

  // Delete the review
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
