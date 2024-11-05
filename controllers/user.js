
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import createToken from '../utils/createToken.js';
import User from '../models/User.js';

export const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      throw new Error("Please fill all the fields");
    }
  
    const userExists = await User.findOne({ email });
    if (userExists) res.status(400).send("User already exists");
  
    // Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
  
    try {
      await newUser.save();
      createToken(res, newUser._id);
  
      res.status(201).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    } catch (error) {
      res.status(400);
      throw new Error("Invalid user data");
    }
  });
  



export const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;

    const existingUser=await User.findOne({email});

    if(existingUser){
        const isPasswordValid=await bcrypt.compare(password,existingUser.password);

    if(isPasswordValid){
        createToken(res,existingUser._id);

        res.status(201).json({
            _id:existingUser._id,
            username:existingUser.username,
            email:existingUser.email,
            isAdmin:existingUser.isAdmin,
        });
    }else{
        res.status(401).json({message:"Invalid Password"})
    }
     }else{
        res.status(401).json({message:"User not found"})
     }
    
    
});

export const logCurrentUser=asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    });
res.status(200).json({message:"Logged out successfully"})
});

export const getAllUser=asyncHandler(async(req,res)=>{
    const users=await User.find({});
    res.json(users)
});

export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
//   console.log(user);
  
if(user){
    res.json({
        _id:user._id,
        username:user.username,
        email:user.email
    })
}else{
    res.status(401).json({message:"User not found"})
    
}
}
);


export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update fields if provided in the request body
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // Update password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    // Save the updated user details
    const updatedUser = await user.save();

    // Respond with updated user information
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    await user.deleteOne(); // Correct method for document deletion
    res.json({ message: 'User removed successfully' });
  });
  

