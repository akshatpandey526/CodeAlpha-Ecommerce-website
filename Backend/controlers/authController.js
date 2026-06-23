const User = require('../model/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// token generate karna 
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}
// reister a user 
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }
        // TODOS ; hash the password before saving to the database 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword });
        // otp generate 
        if (user) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const message = `welcome to the code alpha ecommerce website ${name}!
            thank you for registerin with us. We are excited your otp is ${otp} 
            this otp is valid for 3 minutes `;

            try {
                await sendEmail(email, 'Welcome to Code Alpha - Verify your email', message);
            } catch (emailError) {
                console.error("Email sending failed:", emailError.message);
            }

            res.status(201).json({
                _id: user._id,
                token: generateToken(user._id),
                name: user.name,
                email: user.email,
                role: user.role
            })

        }
    }
    catch (error) {
        res.status(500).json({ message: 'server error' });
    }

}
// login user 

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                token: generateToken(user._id),
                name: user.name,
                email: user.email,
                role: user.role
            })
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' })
        }
    }
    catch (error) {
        res.status(500).json({ message: 'server error' });
    }
}
// get users 
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'server error' });
    }
}


module.exports = { registerUser, loginUser, getUsers };
