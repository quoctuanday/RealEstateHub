const userRouter = require('./user');
const googleRouter = require('./authGoogle');
const paymentRouter = require('./payment');
const postRouter = require('./post');
const chatGPTRouter = require('./chatGPT');
const notificationRouter = require('./notification');
const categoryRouter = require('./category');
const adminRouter = require('./adminRouter');
const newsRouter = require('./newsRouter');
const commentRouter = require('./commentRouter');
const chatBotRouter = require('./chatBotRouter');
const documentsRouter = require('./documentsRouter');

function route(app) {
    app.use('/api/documents', documentsRouter);
    app.use('/api/chatBot', chatBotRouter);
    app.use('/api/comment', commentRouter);
    app.use('/api/news', newsRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/notification', notificationRouter);
    app.use('/api/chatGPT', chatGPTRouter);
    app.use('/api/posts', postRouter);
    app.use('/api/payment', paymentRouter);
    app.use('/auth/google', googleRouter);
    app.use('/api/users', userRouter);
}
module.exports = route;
