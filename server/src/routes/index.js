const userRouter = require('./user');
const googleRouter = require('./authGoogle');

function route(app) {
    app.use('/auth/google', googleRouter);
    app.use('/api/users', userRouter);
}
module.exports = route;
