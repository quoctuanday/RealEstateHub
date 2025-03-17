const Post = require('../models/Post');
const User = require('../models/User');
const { checkout } = require('../routes/user');
class PostController {
    create(req, res) {
        const data = req.body.data;
        console.log(data);
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

    getPost(req, res) {
        const {
            status,
            search,
            startDate,
            endDate,
            postType,
            postId,
            person,
            page,
            limit,
        } = req.query;
        console.log(req.query);
        const userId = req.user.userId;
        const filter = {
            ...(postId && { _id: postId }),
            ...(userId && person && { userId }),
            ...(status && { status }),
            ...(search && { title: { $regex: search, $options: 'i' } }),
            ...(startDate &&
                endDate && {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                }),
            ...(postType && { postType }),
        };

        if (page && limit) {
            const pageNumber = parseInt(page, 10) || 1;
            const limitNumber = parseInt(limit, 10) || 10;
            const skip = (pageNumber - 1) * limitNumber;
            Post.find(filter)
                .skip(skip)
                .limit(limitNumber)
                .then((posts) => {
                    Post.countDocuments(filter)
                        .then((count) => {
                            res.status(200).json({
                                posts,
                                total: count,
                            });
                        })
                        .catch((countError) => {
                            console.error('Error counting posts:', countError);
                            res.status(500).json({
                                message: 'Internal Server Error',
                                error: countError,
                            });
                        });
                })
                .catch((error) => {
                    console.error('Error retrieving posts:', error);
                    res.status(500).json({
                        message: 'Internal Server Error',
                        error,
                    });
                });
        } else {
            Post.find(filter)
                .then((posts) => {
                    res.status(200).json(posts);
                })
                .catch((error) => {
                    console.error('Error retrieving posts:', error);
                    res.status(500).json({
                        message: 'Internal Server Error',
                        error,
                    });
                });
        }
    }

    update(req, res) {
        const data = req.body.data;
        const id = req.params.id;
        Post.findByIdAndUpdate(id, data)
            .then((post) => {
                if (!post) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                if (data.isCheckout) {
                    return User.findByIdAndUpdate(
                        post.userId,
                        { $inc: { accountBalance: -10000 } },
                        { new: true }
                    )
                        .then((user) => {
                            return res.status(200).json({
                                message: 'Updated successfully',
                                post,
                                updatedUser: user,
                            });
                        })
                        .catch((error) => {
                            console.error(
                                'Error updating user account balance:',
                                error
                            );
                            return res.status(500).json({
                                message: 'Error updating user account balance',
                                error,
                            });
                        });
                }
                return res
                    .status(200)
                    .json({ message: 'Updated successfully', post });
            })
            .catch((error) => {
                console.error('Error updating post:', error);
                res.status(500).json({
                    message: 'Internal Server Error',
                    error,
                });
            });
    }
}
module.exports = new PostController();
