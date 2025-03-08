const userRouter = require('./user');
const googleRouter = require('./authGoogle');
const paymentRouter = require('./payment');
const postRouter = require('./post');
const chatGPTRouter = require('./chatGPT');

function route(app) {
    app.use('/api/chatGPT', chatGPTRouter);
    app.use('/api/posts', postRouter);
    app.use('/api/payment', paymentRouter);
    app.use('/auth/google', googleRouter);
    app.use('/api/users', userRouter);
}
module.exports = route;
