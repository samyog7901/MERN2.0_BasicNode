const express = require('express')
const app = express()
const fs = require('fs')
const mongoose = require('mongoose')
const connectToDatabase = require('./database')
const Book = require('./model/bookModel')
const { multer, storage } = require('./middleware/multerConfig')
// CORS Package
const cors = require('cors')



app.use(cors({
    origin: '*'

}))
// expresslai json format bujhne power diye
app.use(express.json())
const upload = multer({ storage : storage })




connectToDatabase()





app.get("/",(req,res)=>{
    res.status(200).json({
        "message" : "Success!"
    })
})


// create
//storage vitrako kura acces dey read garna ++ is very critical thing
// Serve static files (for accessing uploaded images)
app.use("/storage", express.static("storage"))

app.post("/book", upload.single("image"), async (req, res) => {
    console.log("File received:", req.file)

    // Default image URL if no file is uploaded
    let fileName = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB3DSXCp2cUMD2gTlYhjyQzxwCduaqs0VrFjO8iRBbMY_mYkRXQ1JGKXk&s"
    if (req.file) {
        fileName = `https://mern2-0-basicnode-zrh4.onrender.com/storage/${req.file.filename}`
    }

    const { bookName, bookPrice, isbnNumber, authorName, publishedAt, publication } = req.body

    try {
        const newBook = await Book.create({
            bookName,
            bookPrice,
            isbnNumber,
            authorName,
            publishedAt,
            publication,
            imageUrl: fileName // Use the correctly formatted file URL
        });

        res.status(201).json({
            message: "Book created successfully",
            book: newBook
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
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
            message : "Single book fetched successfully!",
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

app.patch("/book/:id",upload.single('image'), async (req,res)=>{
    try{
        const id = req.params.id
        const {bookName, bookPrice, isbnNumber, authorName, publishedAt, publication } = req.body
        const oldDatas = await Book.findById(id)
        let fileName;
        if(req.file){
            const oldImagePath = oldDatas.imageUrl
            const localHostUrlLength = "https://mern2-0-basicnode-zrh4.onrender.com/".length
            const newOldImagePath = oldImagePath.slice(localHostUrlLength)
            console.log(newOldImagePath)
            fs.unlink(`./storage/${newOldImagePath}`,(err)=>{
                if(err){
                    console.log(err)
                }else{
                    console.log("file deleted successfully!")
                }
            })
            fileName = "https://mern2-0-basicnode-zrh4.onrender.com/" + req.file.filename
            

        }
        await Book.findByIdAndUpdate(id,{
            bookName,
            bookPrice,
            isbnNumber,
            authorName,
            publishedAt,
            publication,
            imageUrl: fileName

        })
        res.status(200).json({
            message : "Book updated successfully"
        })
    }catch(e){
        res.status(500).json({
            message : "Something went wrong!"
        })
    }
})



const port = 3000
app.listen(port, () => {
    console.log(`Server has started at port ${port}`)
    })