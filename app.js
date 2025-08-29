const express = require('express');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const connectToDatabase = require('./database');
const Book = require('./model/bookModel');
const { multer, storage } = require('./middleware/multerConfig');
const cors = require('cors');

app.use(cors({ origin: '*' }));
app.use(express.json());

const upload = multer({ storage: storage });

connectToDatabase();

// Serve static files (uploaded images)
app.use("/storage", express.static("storage"));

// Helper for base URL (works both local & Render)
const getBaseUrl = (req) => `${req.protocol}://${req.get("host")}`;

// Create Book
app.post("/book", upload.single("image"), async (req, res) => {
    console.log("File received:", req.file);

    let fileName = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB3DSXCp2cUMD2gTlYhjyQzxwCduaqs0VrFjO8iRBbMY_mYkRXQ1JGKXk&s";
    if (req.file) {
        fileName = `${getBaseUrl(req)}/storage/${req.file.filename}`;
    }

    const { bookName, bookPrice, isbnNumber, authorName, publishedAt, publication } = req.body;

    try {
        const newBook = await Book.create({
            bookName,
            bookPrice,
            isbnNumber,
            authorName,
            publishedAt,
            publication,
            imageUrl: fileName
        });

        res.status(201).json({ message: "Book created successfully", book: newBook });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all Books
app.get("/book", async (req, res) => {
    const books = await Book.find();
    res.status(200).json({ message: "Books found successfully", data: books });
});

// Get single Book
app.get("/book/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.status(200).json({ message: "Single book fetched successfully!", data: book });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Delete Book + image
app.delete("/book/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book?.imageUrl) {
            const fileNameOnly = book.imageUrl.split("/storage/")[1];
            if (fileNameOnly) fs.unlink(`./storage/${fileNameOnly}`, () => {});
        }
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// Update Book
app.patch("/book/:id", upload.single("image"), async (req, res) => {
    try {
        const id = req.params.id;
        const { bookName, bookPrice, isbnNumber, authorName, publishedAt, publication } = req.body;
        const oldData = await Book.findById(id);

        let fileName = oldData.imageUrl;
        if (req.file) {
            // delete old image
            const fileNameOnly = oldData.imageUrl.split("/storage/")[1];
            if (fileNameOnly) fs.unlink(`./storage/${fileNameOnly}`, () => {});
            fileName = `${getBaseUrl(req)}/storage/${req.file.filename}`;
        }

        await Book.findByIdAndUpdate(id, {
            bookName,
            bookPrice,
            isbnNumber,
            authorName,
            publishedAt,
            publication,
            imageUrl: fileName
        });

        res.status(200).json({ message: "Book updated successfully" });
    } catch (e) {
        res.status(500).json({ message: "Something went wrong!" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server started on port ${port}`));
