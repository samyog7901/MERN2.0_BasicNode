const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    bookName : {
        type : String
        // unique : true
    },
    description : {
        type : String
    },
    bookPrice : {
        type : String
    },
    isbnNumber : {
        type : Number
    },
    authorName : {
        type : String
    },
    publishedAt : {
        type : String
    },
    publication : {
        type : String
    },
    imageUrl : {
        type : String
    }
})

// table 'Book' with collections/columns 'bookschema'
const Book = mongoose.model('Book', bookSchema)

module.exports = Book // exporting the model to use in other files