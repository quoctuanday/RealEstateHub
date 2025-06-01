const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const PostCategory = require('../models/PostCategory');
const Category = require('../models/Category');
const FavouritePost = require('../models/favouritePost');
const { checkout } = require('../routes/user');
class PostController {
    create(req, res) {
        const data = req.body.data;
        console.log(data);
        data.userId = req.user.userId;
        const post = new Post(data);

        post.save()
            .then(async (post) => {
                const categoryNames = Object.values(data.category);

                try {
                    for (const categoryName of categoryNames) {
                        const category = await Category.findOne({
                            name: categoryName,
                        });

                        if (category) {
                            const postCategory = new PostCategory({
                                postId: post._id,
                                categoryId: category._id,
                            });

                            await postCategory.save();
                        } else {
                            console.log(
                                `Danh mục '${categoryName}' không tìm thấy.`
                            );
                        }
                    }

                    res.status(200).json({
                        message:
                            'Post created successfully and categories added',
                    });
                } catch (error) {
                    console.log('Error creating PostCategory:', error);
                    res.status(500).json({
                        message: 'Error occurred while creating PostCategory',
                        error,
                    });
                }
            })
            .catch((error) => {
                console.log('Post created error:', error);
                res.status(500).json({
                    message: 'Internal Server Error',
                    error,
                });
            });
    }

    async getPost(req, res) {
        function normalizeProvinceName(name) {
            return name
                .replace(/^(Tỉnh|Thành phố)\s*/i, '')
                .trim()
                .toLowerCase();
        }

        function normalizeDistrictName(name) {
            return name
                .replace(/^(Quận|Huyện|Thị xã|Thành phố)\s*/i, '')
                .trim()
                .toLowerCase();
        }

        try {
            const {
                search,
                startDate,
                endDate,
                postId,
                person,
                postType,
                houseType,
                status,
                page,
                limit,
                isCount,
                district,
                province,
                childCate,
                manageAdmin,
                ...restQuery
            } = req.query;

            const userId = req.user?.userId;
            const userRole = req.user?.role;
            const isManageAdmin =
                manageAdmin === 'true' &&
                (userRole === 'admin' || userRole === 'moderator');
            const normalizedProvince = province
                ? normalizeProvinceName(province)
                : '';
            const normalizedDistrict = district
                ? normalizeDistrictName(district)
                : '';
            //update status when post is expired
            await Post.updateMany(
                { status: 'active', expiredAt: { $lte: new Date() } },
                { $set: { status: 'expired' } }
            );
            //send  a notify when post is nearly expired
            // Gửi thông báo nếu bài viết sắp hết hạn (trong vòng 3 ngày)
            const now = new Date();
            const threeDaysLater = new Date(
                now.getTime() + 3 * 24 * 60 * 60 * 1000
            );

            const postsExpiringSoon = await Post.find({
                status: 'active',
                expiredAt: { $gt: now, $lte: threeDaysLater },
            });

            for (const post of postsExpiringSoon) {
                const daysLeft = Math.ceil(
                    (post.expiredAt - now) / (1000 * 60 * 60 * 24)
                );

                const existingNotice = await Notification.findOne({
                    userId: post.userId,
                    message: { $regex: post.title, $options: 'i' },
                    title: 'Bài viết sắp hết hạn',
                });

                if (!existingNotice) {
                    const notice = new Notification({
                        userId: post.userId,
                        title: 'Bài viết sắp hết hạn',
                        message: `Bài viết "${post.title}" sẽ hết hạn sau ${daysLeft} ngày. Vui lòng gia hạn nếu muốn tiếp tục hiển thị.`,
                    });

                    await notice.save();
                }
            }

            const baseFilter = {
                ...(postType && { postType: postType }),
                ...(houseType && {
                    houseType: Array.isArray(houseType)
                        ? { $in: houseType }
                        : houseType,
                }),
                ...(status && { status: status }),
                ...(postId && { _id: postId }),
                ...(!isManageAdmin && userId && person && { userId }),
                ...(search && { title: { $regex: search, $options: 'i' } }),
                ...(startDate &&
                    endDate && {
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate),
                        },
                    }),
                ...(status === 'active' && {
                    expiredAt: { $gt: new Date() },
                }),
                ...(district &&
                    province && {
                        'location.name': {
                            $regex: new RegExp(
                                `${normalizedDistrict}.*${normalizedProvince}`,
                                'i'
                            ),
                        },
                    }),
            };

            //check post in category
            if (childCate) {
                const categoryNames = Array.isArray(childCate)
                    ? childCate
                    : [childCate];

                const categories = await Category.find({
                    name: { $in: categoryNames },
                });

                const categoryIds = categories.map((c) => c._id);

                const postCategoryLinks = await PostCategory.find({
                    categoryId: { $in: categoryIds },
                });

                const postIds = postCategoryLinks.map((link) => link.postId);

                baseFilter._id = { $in: postIds };
            }

            if (isCount === 'true') {
                const countFields = Object.keys(restQuery);
                const countPromises = countFields.map((field) => {
                    const values = Array.isArray(restQuery[field])
                        ? restQuery[field]
                        : [restQuery[field]];

                    return Promise.all(
                        values.map((value) => {
                            const filter = {
                                ...baseFilter,
                                [field]: value,
                            };
                            return Post.countDocuments(filter).then(
                                (count) => ({
                                    key: `${field}:${value}`,
                                    count,
                                })
                            );
                        })
                    );
                });

                const results = await Promise.all(countPromises);
                const counts = {};

                results.flat().forEach(({ key, count }) => {
                    counts[key] = count;
                });

                return res.status(200).json({ counts });
            }

            // CASE: Pagination
            const filterQuery = {
                ...baseFilter,
                ...restQuery,
            };
            console.log('Base Filter:', baseFilter);
            console.log('Filter Query:', filterQuery);

            if (page && limit) {
                const pageNumber = parseInt(page, 10) || 1;
                const limitNumber = parseInt(limit, 10) || 10;
                const skip = (pageNumber - 1) * limitNumber;

                const [posts, total] = await Promise.all([
                    Post.find(filterQuery)
                        .populate('userId', 'image')
                        .skip(skip)
                        .limit(limitNumber),
                    Post.countDocuments(filterQuery),
                ]);
                const postsWithUserData = await Promise.all(
                    posts.map(async (post) => {
                        const postObj = post.toObject();

                        if (postObj.userId) {
                            postObj.userImage = postObj.userId.image;
                        }

                        if (req.user.userId) {
                            const userId = req.user.userId;
                            const isFav = await FavouritePost.exists({
                                userId,
                                postId: post._id,
                            });
                            postObj.isFavourite = !!isFav;
                        }

                        return postObj;
                    })
                );

                return res
                    .status(200)
                    .json({ posts: postsWithUserData, total });
            }

            const posts = await Post.find(filterQuery).populate(
                'userId',
                'image'
            );
            const postsWithUserData = posts.map((post) => {
                const postObj = post.toObject();
                if (postObj.userId) {
                    postObj.userImage = postObj.userId.image;
                }
                return postObj;
            });
            res.status(200).json(postsWithUserData);
        } catch (error) {
            console.error('getPost error:', error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }

    async update(req, res) {
        try {
            const { data } = req.body;
            const { id } = req.params;
            console.log(data);

            const post = await Post.findByIdAndUpdate(id, data, { new: true });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (data.isCheckout) {
                try {
                    const amountToDeduct = (post.duration || 1) * 1000;
                    const updatedUser = await User.findByIdAndUpdate(
                        post.userId,
                        { $inc: { accountBalance: -amountToDeduct } },
                        { new: true }
                    );
                    return res.status(200).json({
                        message: 'Updated successfully',
                        post,
                        updatedUser,
                    });
                } catch (error) {
                    console.error(
                        'Error updating user account balance:',
                        error
                    );
                    return res.status(500).json({
                        message: 'Error updating user account balance',
                        error,
                    });
                }
            }

            if (data.status === 'active') {
                post.expiredAt = new Date(
                    Date.now() + post.duration * 24 * 60 * 60 * 1000
                );
                await post.save();
                const notice = new Notification({
                    userId: post.userId,
                    title: 'Bài viết đã được duyệt',
                    message: data.message,
                });
                notice
                    .save()
                    .catch((err) =>
                        console.error('Error saving active notification:', err)
                    );
            }

            if (data.status === 'decline') {
                const notice = new Notification({
                    userId: post.userId,
                    title: 'Bài viết đã bị từ chối',
                    message: data.message,
                });
                notice
                    .save()
                    .catch((err) =>
                        console.error('Error saving decline notification:', err)
                    );
            }

            return res
                .status(200)
                .json({ message: 'Updated successfully', post });
        } catch (error) {
            console.error('Error updating post:', error);
            return res.status(500).json({
                message: 'Internal Server Error',
                error,
            });
        }
    }

    async addOrRemoveFavourite(req, res) {
        try {
            const data = req.body.data;
            data.userId = req.user.userId;

            const existing = await FavouritePost.findOne({
                userId: data.userId,
                postId: data.postId,
            });

            if (existing) {
                await FavouritePost.deleteOne({ _id: existing._id });
                return res.status(200).json({ message: 'Đã bỏ yêu thích' });
            } else {
                const newFavourite = new FavouritePost(data);
                await newFavourite.save();
                return res
                    .status(201)
                    .json({ message: 'Đã thêm vào yêu thích' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }

    async getFavourite(req, res) {
        try {
            const userId = req.user.userId;

            const favList = await FavouritePost.find({ userId });

            const postIds = favList.map((fav) => fav.postId);

            const posts = await Post.find({ _id: { $in: postIds } }).populate(
                'userId',
                'image'
            );

            const postsWithFlag = posts.map((post) => {
                const postObj = post.toObject();
                if (postObj.userId) {
                    postObj.userImage = postObj.userId.image;
                }
                postObj.isFavourite = true;
                return postObj;
            });

            return res.status(200).json({ favorites: postsWithFlag });
        } catch (error) {
            console.error('Error getting favourite posts:', error);
            return res.status(500).json({
                message: 'Lỗi khi lấy danh sách bài yêu thích',
                error,
            });
        }
    }
}
module.exports = new PostController();
