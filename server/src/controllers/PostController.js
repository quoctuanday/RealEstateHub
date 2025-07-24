const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const PostCategory = require('../models/PostCategory');
const Category = require('../models/Category');
const ViewPost = require('../models/ViewPost');
const FavouritePost = require('../models/favouritePost');
const { checkout } = require('../routes/user');
const TransactionHistory = require('../models/TransactionHistory');

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

async function updateExpiredPosts() {
    await Post.updateMany(
        { status: 'active', expiredAt: { $lte: new Date() } },
        { $set: { status: 'expired' } }
    );
}

async function sendExpireNotifications() {
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
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
}

function buildBaseFilter(query, userId, isManageAdmin) {
    const {
        postType,
        houseType,
        status,
        postId,
        person,
        search,
        startDate,
        endDate,
        district,
        province,
    } = query;

    const normalizedProvince = province ? normalizeProvinceName(province) : '';
    const normalizedDistrict = district ? normalizeDistrictName(district) : '';

    const baseFilter = {
        ...(postType && { postType }),
        ...(houseType && {
            houseType: Array.isArray(houseType)
                ? { $in: houseType }
                : houseType,
        }),
        ...(status && {
            status: Array.isArray(status) ? { $in: status } : status,
        }),
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

    return baseFilter;
}

async function countFilteredFields(baseFilter, restQuery) {
    const countFields = Object.keys(restQuery);
    const counts = {};

    for (const field of countFields) {
        const values = Array.isArray(restQuery[field])
            ? restQuery[field]
            : [restQuery[field]];

        for (const value of values) {
            let parsedValue;
            switch (value) {
                case 'true':
                    parsedValue = true;
                    break;
                case 'false':
                    parsedValue = false;
                    break;
                case 'null':
                    parsedValue = null;
                    break;
                default:
                    parsedValue =
                        !isNaN(value) && value.trim() !== ''
                            ? Number(value)
                            : value;
                    break;
            }

            const { [field]: _, ...baseWithoutField } = baseFilter;

            const customFilter = {
                ...baseWithoutField,
                [field]: parsedValue,
            };

            const count = await Post.countDocuments(customFilter);
            counts[`${field}:${value}`] = count;
        }
    }

    return counts;
}

async function applyPaginationAndFetchPosts(
    filterQuery,
    page,
    limit,
    reqUserId
) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const [posts, total] = await Promise.all([
        Post.find(filterQuery)
            .populate('userId', 'image')
            // .sort({ createdAt: -1, rate: -1 })
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

            if (reqUserId) {
                const isFav = await FavouritePost.exists({
                    userId: reqUserId,
                    postId: post._id,
                });
                postObj.isFavourite = !!isFav;
            }

            return postObj;
        })
    );

    return { posts: postsWithUserData, total };
}

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
        try {
            const {
                search,
                startDate,
                endDate,
                postId,
                person,
                postType,
                houseType,
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

            await updateExpiredPosts();
            await sendExpireNotifications();
            //
            let baseFilter = buildBaseFilter(req.query, userId, isManageAdmin);

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
                const counts = await countFilteredFields(baseFilter, restQuery);
                return res.status(200).json({ counts });
            }

            const filterQuery = { ...baseFilter, ...restQuery };

            if (page && limit) {
                const result = await applyPaginationAndFetchPosts(
                    filterQuery,
                    page,
                    limit,
                    userId
                );
                return res.status(200).json(result);
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
            const userId = req.user.userId;
            const { data } = req.body;
            const { id } = req.params;
            console.log(data);

            const post = await Post.findByIdAndUpdate(id, data, { new: true });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            if (data.isView) {
                const existingView = await ViewPost.findOne({
                    userId,
                    postId: id,
                });
                if (!existingView) {
                    await Post.findByIdAndUpdate(id, { $inc: { view: 1 } });

                    await ViewPost.create({ userId, postId: id });

                    return res.status(200).json({ message: 'View recorded' });
                } else {
                    return res.status(200).json({ message: 'Already viewed' });
                }
            }
            //updateCheckout
            if (data.isCheckout) {
                try {
                    const amountToDeduct = (post.duration || 1) * 1000;
                    const updatedUser = await User.findByIdAndUpdate(
                        post.userId,
                        { $inc: { accountBalance: -amountToDeduct } },
                        { new: true }
                    );
                    await TransactionHistory.create({
                        userId: post.userId,
                        amount: -amountToDeduct,
                    });
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
    async getTransactionHistory(req, res) {
        try {
            const userId = req.user.userId;
            const { startDate, endDate } = req.query;
            console.log(startDate, endDate);

            const dateFilter = {};
            if (startDate) {
                dateFilter.$gte = new Date(startDate);
            }
            if (endDate) {
                dateFilter.$lte = new Date(endDate);
            }

            const filter = { userId };
            if (Object.keys(dateFilter).length > 0) {
                filter.createdAt = dateFilter;
            }

            const transactions = await TransactionHistory.find(filter)
                .sort({ createdAt: 1 })
                .select('amount createdAt -_id');

            res.status(200).json({ transactions });
        } catch (error) {
            console.error('Error getting transaction history:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    }
}
module.exports = new PostController();
