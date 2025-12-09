import express from "express";
import fs from "fs";
import Book from "./model/bookModel.js";
import upload from "./middleware/multerConfig.js"; // default export
import cors from "cors";
import connectToDatabase from "./database/index.js";
const app = express()




app.use(cors({
    origin: '*'

}))
// expresslai json format bujhne power diye
app.use(express.json())





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
    try {
      let imageUrl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB3DSXCp2cUMD2gTlYhjyQzxwCduaqs0VrFjO8iRBbMY_mYkRXQ1JGKXK&s";
  
      if (req.file) {
        imageUrl = req.file.path; // cloudinary secure_url
      }
  
      const newBook = await Book.create({
        ...req.body,
        imageUrl,
      });
  
      res.status(201).json({
        message: "Book created successfully",
        data: newBook,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

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

app.patch("/book/:id", upload.single("image"), async (req, res) => {
    try {
      const id = req.params.id;
      const book = await Book.findById(id);
  
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      let imageUrl = book.imageUrl;
  
      // === If new image provided ===
      if (req.file) {
        // delete old image unless it's default
        if (!book.imageUrl.includes("gstatic")) {
          const publicId = book.imageUrl
            .split("/")
            .pop()
            .split(".")[0];
  
          await cloudinary.uploader.destroy("Spiritual-Hub/" + publicId);
        }
  
        imageUrl = req.file.path; // cloudinary secure_url
      }
  
      await Book.findByIdAndUpdate(id, {
        ...req.body,
        imageUrl,
      });
  
      res.status(200).json({ message: "Book updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
  



const port = 3000
app.listen(port, () => {
    console.log(`Server has started at port ${port}`)
})