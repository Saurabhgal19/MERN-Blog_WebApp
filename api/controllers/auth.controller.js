import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req,res,next) => {
try{
    const { username ,email ,password } = req.body;

    //validation
    if( !username || 
        !email || 
        !password ||
        username === '' || 
        email ==='' || 
        password === ''
        ) {

        next(errorHandler(400, "All fields are required"));
        
        // validation message
        // return res.status(403).json({
        //     success:false,
        //     message:'Fill all fields'})
    }

    //existing user
    const existingUser = await User.findOne({email});
    
        if(existingUser){
            return res.status(401).json({
                success:false,
                message: "Email already exists"
            })
    }

    //password hashing
    const hashedPassword = await bcryptjs.hashSync(password, 10);

    //create entry into DB
    const newUser = new User({
        username,
        email,
        password:hashedPassword,
    });
    //save data into mongo
    await newUser.save();

    return res.status(200).json({
        success:true,
        message:"User is registered Successfully",
        newUser,
    });
}
    catch (error) {

        console.error("Error during user registration", error);
        next(error);
        // return res.status(500).json({
        //     success:false,
        //     message:"User cannot be registrered. Please try again",
        //     //message:  error.message,    
        // })    
   } 
};

//Sign In Code

export const signin = async (req,res,next) => {

    //get data
    const{email, password}= req.body;

    if(!email || !password || email ==="" || password ===""){
       return next(errorHandler(400, 'All fields are required'))
    }

    try{
        const validUser = await User.findOne({email})

        if(!validUser){
            return next(errorHandler(404,'User not found'));
        }
        //comparing password
        const validPassword= bcryptjs.compareSync(password, validUser.password);

        if(!validPassword){
            return next(errorHandler(401,"Invalid Password"));
        }

        //create token
        const token = jwt.sign({ id: validUser._id,},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        )

        //hide a password from userData
        const {password : pass,  ...rest} = validUser._doc

        res.status(200).cookie('access_token', token, {
            httpOnly:true}).json({
                success: true,
                token: token,
                message:"SignIn Successfully",
                //validUser,
                rest,
            });
    }
    catch(error){
        return next(errorHandler(500,"Invalid Response"));
    }
}