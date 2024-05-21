import { User } from '../models/user.model.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import {apiError} from '../utils/apiError.js'
import {apiResponse} from '../utils/apiResponse.js'
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import {COOKIE_OPTIONS} from '../constant.js'


const assignAccessAndRefreshToken = async(userId) => {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return {accessToken, refreshToken}
}

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

const login = asyncHandler(async (req, res, next) => {
    // get email password from client
    // validate credentials
    // check for user from db
    // validate for password
    // generate access refresh token => store refreshToken in DB & send both to client via res & cookie
    const {email, password} = req.body;
    if(!(email || password)) return next(new apiError(400, 'email password are required'));

    const user = await User.findOne({email});
    if(!user) return next(new apiError(404, 'user does not exist'));

    if(!user.isPasswordCorrect(password, user.password)) return next(new apiError(400, 'invalid user credentials'));

    user.password = undefined;
    const {accessToken, refreshToken} = await assignAccessAndRefreshToken(user._id)

    res.status(200)
    .cookie('accessToken', accessToken, COOKIE_OPTIONS)
    .cookie('refreshToken', refreshToken, COOKIE_OPTIONS)
    .json(new apiResponse(200, {user,accessToken, refreshToken}, 'user logged in successfully'))
})



export {registerUser, login}