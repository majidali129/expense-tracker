import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const protectRoute = asyncHandler(async (req, res, next) => {
   try {
     let token;
     if(req.cookies?.accessToken || req.body?.accessToken || req.header('authorization')){
         token = req.cookies?.accessToken || req.header('authorization').replace('Bearer ', '')
     }

     if(!token) return next(new apiError(401, 'unauthorized request! You are not logged in. Please login to get access'));

     const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     const user = await User.findById(decode._id);
     if(!user) return next(new apiError(401, 'invalid access token'));

     req.user = user;
     next()
   } catch (error) {
    return next(new apiError(401, error?.message || 'invalid access token'))
   }
})