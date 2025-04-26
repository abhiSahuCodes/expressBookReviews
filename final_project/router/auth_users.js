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
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
