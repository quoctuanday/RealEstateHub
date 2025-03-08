const Post = require('../models/Post');
class PostController {
    create(req, res) {
        const data = req.body.data;
        data.userId = req.user.userId;
        const post = new Post(data);
        post.save()
            .then((post) => {
                res.status(200).json({
                    message: 'Post created successfully',
                });
            })
            .catch((error) => {
                console.log('Post created error:', error);
                res.status(500).json({
                    message: 'Internal Server Error',
                    error,
                });
            });
    }
}
module.exports = new PostController();
