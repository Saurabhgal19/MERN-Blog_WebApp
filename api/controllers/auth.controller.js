import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

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