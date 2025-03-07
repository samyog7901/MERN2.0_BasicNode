const express = require('express')
const app = express()
const mongoose = require('mongoose')
const connectToDatabase = require('./database')
const Book = require('./model/bookModel')
const { multer, storage } = require('./middleware/multerConfig')

// expresslai json format bujhne power diye
app.use(express.json())
const upload = multer({ storage : storage })



connectToDatabase()





app.get("/",(req,res)=>{
    res.status(200).json({
        "message" : "Welcome to my API"
    })
})


// create
app.post("/book",upload.single('image'),async(req,res)=>{
    const {bookName,bookPrice,isbnNumber,authorName,publishedAt,publication} = req.body
    await Book.create({
        bookName,
        bookPrice,
        isbnNumber,
        authorName,
        publishedAt,
        publication,
        image : req.file.filename

    })
    res.status(201).json({
        "message" : "Book created successfully"
    })
})

// all read
app.get("/book",async (req,res)=>{
    const books = await Book.find() //array return garaxa
    res.status(200).json({
        "message" : "Books found successfully",
        data : books
    })
})

// single read
app.get("/book/:id",async (req,res)=>{
    try{
        const id = req.params.id
        const book = await Book.findById(id) //object return garxa
        res.status(200).json({
            message : "Single book fetched successfully",
            data : book
        })
    }catch(error){
        res.status(500).json({
            message : "Something went wrong"
        })
    }
})

// delete operation
app.delete("/book/:id",async (req,res)=>{
    try{    
        const id = req.params.id
        await Book.findByIdAndDelete(id)
        res.status(200).json({
            message : "Book deleted successfully"
        })
        }catch(error){
            res.status(500).json({
                message : "Something went wrong"
            })
        }
})

// update operation

app.patch("/book/:id",async (req,res)=>{
    try{
        const id = req.params.id
        const {bookName, bookPrice, isbnNumber, authorName, publishedAt, publication } = req.body
        await Book.findByIdAndUpdate(id,{
            bookName,
            bookPrice,
            isbnNumber,
            authorName,
            publishedAt,
            publication

        })
        res.status(200).json({
            message : "Book updated successfully"
        })
    }catch(e){
        res.status(500).json({
            message : "Something went wrong"
        })
    }
})




const port = 3000
app.listen(port, () => {
    console.log(`Server has started at port ${port}`)
    })