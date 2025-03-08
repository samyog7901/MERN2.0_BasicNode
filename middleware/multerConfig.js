const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // file validation
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if (!allowedFileTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only images are allowed.'))

        }
        cb(null, './storage') //cb(error, success)
    },
    filename: (req, file, cb) => {
        cb(null,Date.now()+ "-" + file.originalname) //cb(error, success)
    }

})

module.exports = {multer, storage}  //exporting the multer and storage object

