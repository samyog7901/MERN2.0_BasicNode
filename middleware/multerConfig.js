import multer from 'multer'
import { storage } from '../services/cloudinaryConfig.js'

const upload = multer({
    storage :storage,
    fileFilter : (req,file,cb)=>{
        const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
        if(allowedFileTypes.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'), false)
        }
    },
    limits : {
        fileSize: 1024 * 1024 * 2 // 2MB
    }
})

export default upload

