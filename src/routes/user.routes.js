
import express from 'express'
import { login, registerUser } from '../controllers/auth.controller.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router()


router.route('/register-user').post( upload.single('avatar') ,registerUser)
router.route('/login').post(login)


export default router;