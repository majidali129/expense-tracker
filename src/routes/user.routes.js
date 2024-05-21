
import express from 'express'
import { registerUser } from '../controllers/auth.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router()


router.route('/register-user').post( upload.single('avatar') ,registerUser)


export default router;