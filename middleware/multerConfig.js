const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './storage') //cb(error, success)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname) //cb(error, success)
    }

})

module.exports = {multer, storage}  //exporting the multer and storage object

