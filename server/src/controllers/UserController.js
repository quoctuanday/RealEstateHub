const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoSanitize = require('mongo-sanitize');
const {
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET,
} = require('../config/env/index');

class UserController {
    async createUser(req, res) {
        let { confirmPassword, ...data } = req.body.data;
        //Check data
        data = mongoSanitize(data);

        try {
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(data.password, salt);
            data.password = hashedPass;

            const newUser = new User(data);
            await newUser.save();

            console.log('User created successfully');
            return res
                .status(201)
                .json({ message: 'User created successfully' });
        } catch (error) {
            console.log('Error creating user: ', error);
            return res
                .status(500)
                .json({ message: 'Internal server error', error });
        }
    }

    async login(req, res) {
        try {
            const data = req.body.data;
            console.log(data);
            User.findOne({ email: data.email }).then(async (user) => {
                if (!user)
                    return res.status(401).json({ message: 'User not found' });
                const passwordMatch = await bcrypt.compare(
                    data.password,
                    user.password
                );
                if (!passwordMatch)
                    return res
                        .status(401)
                        .json({ message: 'Password is wrong' });
                //create ACCToken and REFToken
                const accessToken = jwt.sign(
                    { userId: user._id, role: user.role },
                    ACCESS_TOKEN_SECRET,
                    { expiresIn: '5h' }
                );
                const refreshToken = jwt.sign(
                    { userId: user._id, role: user.role },
                    REFRESH_TOKEN_SECRET,
                    { expiresIn: '24h' }
                );
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.status(200).json({
                    message: 'Login successful',
                    accessToken,
                });
            });
        } catch (err) {
            console.error(err);
            return res
                .status(500)
                .json({ message: 'Internal server error', error });
        }
    }

    getUser(req, res) {
        const userId = req.user.userId;
        console.log(req.user);
        console.log(userId);
        User.findById(userId)
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                return res.status(200).json(user);
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            });
    }
}
module.exports = new UserController();
