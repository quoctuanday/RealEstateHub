const Comment = require('../models/Comment');
const Post = require('../models/Post');

class CommentController {
    create = async (req, res) => {
        try {
            const userId = req.user.userId;
            const commentData = req.body.data?.data;
            if (!commentData) {
                return res
                    .status(400)
                    .json({ message: 'Missing comment data' });
            }

            commentData.userId = userId;

            const comment = new Comment(commentData);
            await comment.save();

            const post = await Post.findById(commentData.postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const comments = await Comment.find({ postId: commentData.postId });

            if (comments.length === 0) {
                return res.status(200).json({
                    message:
                        'Create comment successfully, but no comments found for rating',
                });
            }

            const totalRate = comments.reduce(
                (sum, c) => sum + (c.rate || 0),
                0
            );
            const averageRate = totalRate / comments.length;

            await Post.findByIdAndUpdate(commentData.postId, {
                rate: averageRate,
            });

            return res.status(200).json({
                message: 'Create comment successfully and update post rate',
            });
        } catch (error) {
            console.error('Error creating comment:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    get = async (req, res) => {
        try {
            const postId = req.params.postId;
            const comments = await Comment.find({ postId }).populate(
                'userId',
                'userName image'
            );

            if (!comments || comments.length === 0) {
                return res.status(404).json({ message: 'No comments found' });
            }

            const formattedComments = comments.map((comment) => {
                const { userId, ...rest } = comment.toObject();
                return {
                    ...rest,
                    userId: userId?._id || null,
                    userName: userId?.userName || null,
                    image: userId?.image || null,
                };
            });

            return res.status(200).json({
                message: 'List Comment',
                comment: formattedComments,
            });
        } catch (error) {
            console.error('Get comment error:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    delete = async (req, res) => {
        try {
            const commentId = req.params.commentId;
            const deleted = await Comment.findByIdAndDelete(commentId);

            if (!deleted) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            return res.status(200).json({ message: 'Comment deleted' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    block = async (req, res) => {
        try {
            const commentId = req.params.commentId;
            const updated = await Comment.findByIdAndUpdate(commentId, {
                isBlocked: true,
            });

            if (!updated) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            return res.status(200).json({ message: 'Comment blocked' });
        } catch (error) {
            console.error('Error blocking comment:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}

module.exports = new CommentController();
