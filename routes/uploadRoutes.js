import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({ //diskStorage takes 2 functions ==> destination and filename
  destination(req, file, cb) { //cb stands for callback
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` //extname ==> extension name
      //return fieldname-currentdate.extension name
    )
  },
})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype) //e.g. jsp have /jpg and png have png/

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    //in case of error
    cb('Images only!')
  }
}

//middleware for route
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

//end point
//route would be the api/upload

router.post('/', upload.single('image'), (req, res) => {
    res.send(`/${req.file.path}`)//it will give us the path of image that we can set in frontend
  })

export default router
