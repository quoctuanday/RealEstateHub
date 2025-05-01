const News = require('../models/News');

class NewsController {
    create(req, res) {
        const userId = req.user.userId;
        const data = req.body.data;
        data.userId = userId;
        console.log(data);
        const news = new News(data);
        news.save()
            .then(() => {
                res.status(200).json({ message: 'Create News successfully' });
            })
            .catch((error) => {
                console.log('Create news error: ', error);
                res.status(500).json({ message: 'Internal Server Error' });
            });
    }
    update(req, res) {
        const data = req.body.data.data;
        const newsId = req.params.id;
        console.log(data, newsId);
        News.findByIdAndUpdate(newsId, data)
            .then((news) => {
                res.status(200).json({ message: 'Update news successfully' });
            })
            .catch((error) => {
                console.log('Error updating news: ', error);
                res.status(500).json({ message: 'Internal Server Error' });
            });
    }
    delete(req, res) {
        const newsId = req.params.newsId;
        const userId = req.user.userId;
        News.delete({ _id: newsId, userId: userId })
            .then(() => {
                console.log('Delete News Ok!');
                res.status(200).json({ message: 'News deleted successfully' });
            })
            .catch((error) => {
                console.log('error delete News: ', error);
                res.status(500).json({ message: 'Internal Server Error' });
            });
    }
    getDeleteNews(req, res) {
        const userId = req.user.userId;
        News.findWithDeleted({ userId: userId, deleted: true })
            .then((news) => {
                if (news) {
                    res.status(200).json({ message: 'List News delete', news });
                }
            })
            .catch((error) => {
                console.log('error get list news deleted', error);
                res.status(500).json({ message: 'Internal server error' });
            });
    }
    restoreNewsPersonal(req, res, next) {
        const userId = req.user.userId;
        const newsId = req.params.newsId;
        News.restore({ _id: newsId, userId: userId })
            .then(() => {
                console.log('Restore News ok!');
                res.status(200).json({ message: 'News has been restore' });
            })
            .catch((error) => {
                console.log('Error restore News', error);
                res.status(500).json({ message: 'Internal Server Error' });
            });
    }
    forceDeleteNewsPersonal(req, res, next) {
        const newsId = req.params.newsId;
        News.deleteOne({ _id: newsId })
            .then(() => {
                res.status(200).json({
                    message: 'News has been force deleted ',
                });
            })
            .catch((error) => {
                console.log('error force delete: ', error);
                res.status(500).json({ message: 'Internal Server Error' });
            });
    }
    async getAllNews(req, res) {
        try {
            const {
                search,
                startDate,
                endDate,
                page,
                limit,
                newsId,
                ...restQuery
            } = req.query;

            const filter = {
                ...(search && {
                    title: { $regex: search, $options: 'i' },
                }),
                ...(newsId && { _id: newsId }),
                ...(startDate &&
                    endDate && {
                        createdAt: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate),
                        },
                    }),
                ...restQuery,
            };

            const pageNumber = parseInt(page, 10) || 1;
            const limitNumber = parseInt(limit, 10) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            const [news, total] = await Promise.all([
                News.find(filter)
                    .populate({ path: 'userId', select: 'userName' })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limitNumber),
                News.countDocuments(filter),
            ]);

            const formattedNews = news.map((item) => ({
                _id: item._id,
                title: item.title,
                content: item.content,
                image: item.image,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                userName: item.userId?.userName || 'Unknown',
            }));

            res.status(200).json({
                message: 'Danh sách bài viết',
                data: formattedNews,
                total,
                page: pageNumber,
                limit: limitNumber,
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tin tức:', error);
            res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }
}
module.exports = new NewsController();
