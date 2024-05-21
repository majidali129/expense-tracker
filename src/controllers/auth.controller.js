import { User } from '../models/user.model.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from '../utils/apiError.js'
import {apiResponse} from '../utils/apiResponse.js'
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';


const registerUser = asyncHandler(async(req, res, next) => {
    // accept data from client
    // validate the request
    // secure the password befor save to db
    // check for user existance in db. show error if exists already
    // check for avatar => required
    // upload avatar to cloudinary => get actual url
    // validate if cloudinary url available
    // remove files form locally
    // create new object to save in db
    // send response
    const {fullName, username, email, password,confirmPassword} = req.body;

    if([fullName, username, email, password, confirmPassword].some(el => el === ''))
        return next(new apiError(400, 'all fields are required'));

    const userExistance = await User.findOne({
        $or: [{email}, {username}]
    });
    if(userExistance) return next(new apiError(400, 'user with these credentials already exists'));

    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath) return next(new apiError(400, 'user avatar is mendatory'));

    const avatar = await uploadToCloudinary(avatarLocalPath);
    if(!avatar) return next(new apiError(400, 'avatar is required'))

    const createdUser = await User.create({
        username: username?.trim().toLowerCase(),
        fullName,
        email,
        password,
        confirmPassword,
        avatar: avatar?.url,
    });

    createdUser.password = undefined;
    createdUser.__v = undefined;

    if(!createdUser)
        return next(new apiError(500, 'something went wrong while creating new user. try again later'));

    res.json(201, new apiResponse(201, createdUser, 'user registered successfully'))

})

export {registerUser}