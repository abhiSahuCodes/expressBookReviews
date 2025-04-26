const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  // Check if username already exists
  if (users.length > 0) {
    const userExists = users.find((user) => user.username === username);
    if (userExists) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }
  }

  // Create new user
  const newUser = {
    username: username,
    password: password,
  };

  users.push(newUser);
  return res.status(201).json({
    message: "User successfully registered",
    user: username,
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  })
    .then((bookList) => {
      res.status(200).json(bookList);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error fetching books", error: error.message });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  // Create a Promise to handle the book search
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error(`The book with ISBN ${isbn} was not found`));
      }
    }, 1000);
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  // Create a Promise to handle the book search by author
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const allKeys = Object.keys(books);
      const bookByAuthor = allKeys
        .filter((key) => books[key].author === author)
        .reduce((acc, key) => {
          acc[key] = books[key];
          return acc;
        }, {});

      if (Object.keys(bookByAuthor).length > 0) {
        resolve(bookByAuthor);
      } else {
        reject(new Error(`No books found for author: ${author}`));
      }
    }, 1000);
  })
    .then((bookByAuthor) => {
      res.status(200).json(bookByAuthor);
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  // Create a Promise to handle the book search by title
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const allKeys = Object.keys(books);
      const bookByTitle = allKeys
        .filter((key) => books[key].title === title)
        .reduce((acc, key) => {
          acc[key] = books[key];
          return acc;
        }, {});

      if (Object.keys(bookByTitle).length > 0) {
        resolve(bookByTitle);
      } else {
        reject(new Error(`No books found for title: ${title}`));
      }
    }, 1000);
  })
    .then((bookByTitle) => {
      res.status(200).json(bookByTitle);
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: `No reviews found for ISBN: ${isbn}` });
  }
});

module.exports.general = public_users;
