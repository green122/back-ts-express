import {S3} from 'aws-sdk';
import {Router} from "express";
import multer, {diskStorage} from 'multer';
import multerS3 from 'multer-s3';

import verifyToken from "../../helpers/verifyToken";
import Controller from "./listing.controller";
import { resolve } from 'path';

const user: Router = Router();
const controller = new Controller();
const s3 = new S3({
  accessKeyId: '',
  secretAccessKey: '',
  region: 'eu-central-1',
})

const storage = diskStorage({

  destination:  (req, file, cb) => {
    console.log(file);
    cb(null, resolve(__dirname, './test'))
  },

  filename: (req, file, cb) => {
    console.log('!!!!!!!!!!!', file);
    cb(null, __dirname + file.originalname)
  }
})

const upload1 = multer({
  storage
})

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'e-shop-brooche-bouquet',
    metadata:  (req, file, cb) => {
      console.log('!!!!!!!!', file)
      cb(null, {fieldName: file.fieldname});
    },
    key:  (req, file, cb) => {
      console.log('!!!!!!!!', file)
      cb(null, Date.now().toString()+file.originalname)
    }
  })
})
// Retrieve all Users
user.get("/", controller.findAll);

// Retrieve a Specific User
user.get("/:id", controller.findOne);

// Update a User with Id
user.post("/:id", upload.array('file'), controller.update);

// Delete a User with Id
user.delete("/:id", controller.remove);

export default user;
