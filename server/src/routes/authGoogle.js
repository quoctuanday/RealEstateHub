const express = require('express');
const passport = require('passport');
const router = express.Router();
const googleController = require('../controllers/GoogleController');

router.get(
    '/',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
    '/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/login',
    }),
    googleController.callback
);

module.exports = router;
