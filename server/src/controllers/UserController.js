const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoSanitize = require('mongo-sanitize');
const nodemailer = require('nodemailer');
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
    logOut(req, res) {
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Log out successfully' });
    }

    refreshToken(req, res) {
        const refreshToken = req.cookies.refreshToken;
        console.log('refresh token', refreshToken);
        if (!refreshToken) return res.status(401);
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
                if (err) {
                    console.log('refresh token error', err);
                    return res.status(403);
                }

                //Create new access token
                const newAccessToken = jwt.sign(
                    { userId: user.userId, role: user.role },
                    ACCESS_TOKEN_SECRET,
                    { expiresIn: '5h' }
                );
                res.json({ accessToken: newAccessToken });
            }
        );
    }

    update(req, res) {
        const data = req.body.data;
        const userId = req.user.userId;
        User.findByIdAndUpdate(userId, data)
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                }
                res.status(200).json({ message: 'User successfully updated' });
            })
            .catch((error) => {
                res.status(500).json({ message: 'Internal Server Error' });
            });
    }

    //Password change
    async changePassword(req, res) {
        try {
            let { confirmPassword, ...data } = req.body.data;
            const userId = req.user.userId;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const passwordMatch = await bcrypt.compare(
                data.oldPassword,
                user.password
            );
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Password mismatch' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash(data.password, salt);

            await User.findByIdAndUpdate(userId, { password: hashedPass });

            return res.status(200).json({ message: 'Password updated' });
        } catch (error) {
            console.error('Error changing password:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async forgotPassword(req, res) {
        const email = req.body.data.email;

        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: 'sunny.emmerich@ethereal.email',
                    pass: '4rnr54CG52jTJJgj8b',
                },
            });
            console.log(email);

            const user = await User.findOne({ email: email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const userId = user._id;
            const info = await transporter.sendMail({
                from: '"Admin web batdongsan" <admin@ethereal.email>',
                to: email,
                subject: 'Reset Password ✔',
                text: 'Please click the link below to reset your password.',
                html: `
                        <b>Please click the link below to reset your password.</b><br>
                        <a href="http://localhost:3000/forgotPass/${userId}">http://localhost:3000/forgotPass/${userId}</a>
                    `,
            });

            console.log('Message sent: %s', info.messageId);

            res.status(200).json({ message: 'Reset email sent successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    resetPass(req, res) {
        const userId = req.params.userId;
        let { passwordConfirm, ...data } = req.body.data;
        const pass = data.password;
        bcrypt.hash(pass, 10).then((hashedPass) => {
            data.password = hashedPass;
            console.log(data);
            User.findByIdAndUpdate(userId, data)
                .then((user) => {
                    if (!user) return;
                    res.status(200).json({
                        message: 'Reset password successfully',
                    });
                })
                .catch((err) => {
                    console.log('Reset password failed: %s', err);
                    return res
                        .status(500)
                        .json({ error: 'Internal Server Error' });
                });
        });
    }

    getAllUsers(req, res) {
        const { search, startDate, endDate, role, isBlocked, page, pageSize } =
            req.query;
        const filter = {
            ...(search && { userName: { $regex: search, $options: 'i' } }),
            ...(startDate &&
                endDate && {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                }),
            ...(role && { role: role }),
            ...(isBlocked !== undefined && { isBlocked: isBlocked === 'true' }),
        };

        const currentPage = Number(page) || 1;
        const limit = Number(pageSize) || 10;
        const skip = (currentPage - 1) * limit;

        Promise.all([
            User.countDocuments(filter),
            User.find(filter).skip(skip).limit(limit),
        ])
            .then(([totalPosts, users]) => {
                res.json({ data: users, totalPosts });
            })
            .catch((error) => {
                res.status(500).json({
                    message: 'Internal Server Error',
                    error,
                });
            });
    }

    updateMany(req, res) {
        const data = req.body.data;
        console.log(data);
        const userId = data.userId;
        User.findByIdAndUpdate(userId, data)
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                }
                res.status(200).json({ message: 'User successfully updated' });
            })
            .catch((error) => {
                res.status(500).json({ message: 'Internal Server Error' });
            });
    }
}
module.exports = new UserController();
