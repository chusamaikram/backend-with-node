import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    //get user detail from frontend
    //validation on user registration
    // check if  user already exist : check with username & email
    // check for avatar or images 
    // upload assets to cloudinary, 
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const { fullname, email, password, username, } = req.body

    //validation
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if already exist
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(409, "User already exist with this email or username")
    }

    //chk for avatar and cover image

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocal = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "upload avatar")
    }

    // upload them to cloudinary 

    const avatarCloud = await uploadToCloudinary(avatarLocalPath)
    const coverImageCloud = await uploadToCloudinary(coverImageLocal)

    if (!avatarCloud) {
        throw new ApiError(400, "Avatar file is required")
    }

    //create user object

    const user = await User.create({
        fullname,
        avatar: avatarCloud.url,
        coverImage: coverImageCloud?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //remove password and refresh token
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if (!createdUser) {
        throw new ApiError(500, "User registration failed")
    }

    // return api response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
}
)

export { registerUser } 