const express = require('express');
const cors = require('cors');
const route = require('./routes');
const http = require('http');
const {
    CLIENT_PORT,
    PORT,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
} = require('./config/env');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const User = require('./models/User');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
db.connect();

const server = http.createServer(app);

app.use(cookieParser());

//CORS
app.use(
    cors({
        origin: `http://localhost:${CLIENT_PORT}`,
        credentials: true,
    })
);

//Google
passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                        userName: profile.displayName,
                        image:
                            profile.photos && profile.photos.length > 0
                                ? profile.photos[0].value.replace(
                                      /s\d+-c/,
                                      's500-c'
                                  )
                                : undefined,
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);
app.use(passport.initialize());

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

//Config route
route(app);

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
