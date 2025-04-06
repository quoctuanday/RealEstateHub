const User = require('../models/User');
const Post = require('../models/Post');
// const News = require('../models/News');

class AdminController {
    async getTotal(req, res) {
        try {
            const { start, end } = req.query;

            const matchDateRange = {
                createdAt: {
                    $gte: new Date(start),
                    $lte: new Date(end),
                },
            };

            const userCountPromise = User.countDocuments(matchDateRange);

            const totalPostCountPromise = Post.countDocuments(matchDateRange);

            const postStatusCountPromise = Post.aggregate([
                { $match: matchDateRange },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]);

            const currentPostCountPromise = Post.countDocuments(matchDateRange);

            const paidPostRevenuePromise = Post.aggregate([
                {
                    $match: {
                        ...matchDateRange,
                        isCheckout: true,
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: { $multiply: ['$duration', 1000] },
                        },
                    },
                },
            ]);

            const [
                userCount,
                totalPostCount,
                postStatusCounts,
                currentPostCount,
                paidPostRevenue,
            ] = await Promise.all([
                userCountPromise,
                totalPostCountPromise,
                postStatusCountPromise,
                currentPostCountPromise,
                paidPostRevenuePromise,
            ]);

            const statusCountObj = postStatusCounts.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {});

            const totalRevenue = paidPostRevenue[0]?.totalRevenue || 0;

            const data = {
                userCount,
                totalPostCount,
                currentPostCount,
                postStatusCounts: statusCountObj,
                totalRevenue,
            };

            res.status(200).json({ message: 'Thống kê tổng hợp', data });
        } catch (error) {
            console.log('get count error: ', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    showTotalAmounts(req, res, next) {
        const { start, end } = req.query;
        console.log('total revenue', start, end);
        const startDate = new Date(start);
        const endDate = new Date(end);

        const paidPostRevenuePromise = Post.aggregate([
            {
                $match: {
                    isCheckout: true,
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                    },
                    totalRevenue: {
                        $sum: { $multiply: ['$duration', 1000] },
                    },
                },
            },
            {
                $sort: {
                    '_id.month': 1,
                },
            },
        ]);

        Promise.all([paidPostRevenuePromise])

            .then(([paidRevenue]) => {
                res.json({
                    paidRevenue,
                });
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu:', error);
                next(error);
            });
    }
}
module.exports = new AdminController();
