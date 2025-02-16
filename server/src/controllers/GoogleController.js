const jwt = require('jsonwebtoken');
const {
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET,
} = require('../config/env/index');

class GoogleController {
    callback(req, res) {
        const user = req.user;
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role || 'user' },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '5h' }
        );
        const refreshToken = jwt.sign(
            { userId: user._id, role: user.role || 'user' },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.redirect(`http://localhost:3000/home?accessToken=${accessToken}`);
        // res.status(200).json({ message: 'Login successful', accessToken });
    }
}
module.exports = new GoogleController();
