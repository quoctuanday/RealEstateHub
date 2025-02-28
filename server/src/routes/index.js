const userRouter = require('./user');
const googleRouter = require('./authGoogle');
const paymentRouter = require('./payment');

function route(app) {
    app.use('/api/payment', paymentRouter);
    app.use('/auth/google', googleRouter);
    app.use('/api/users', userRouter);
}
module.exports = route;
