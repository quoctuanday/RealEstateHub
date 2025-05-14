const Documents = require('../models/Documents');

class DocumentsController {
    async create(req, res) {
        try {
            const data = req.body.data;

            console.log('Received data:', data);

            const legalDocument = new Documents(data);
            await legalDocument.save();

            res.status(201).json({
                message: 'Tạo văn bản thành công',
                data: legalDocument,
            });
        } catch (error) {
            console.error('Lỗi khi tạo văn bản:', error);
            res.status(500).json({
                message: 'Đã xảy ra lỗi khi tạo văn bản',
                error: error.message,
            });
        }
    }

    async get(req, res) {
        try {
            const {
                search,
                startDate,
                endDate,
                page,
                limit,
                documentId,
                ...restQuery
            } = req.query;

            const filter = {
                ...(search && {
                    title: { $regex: search, $options: 'i' },
                }),
                ...(documentId && { _id: documentId }),
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

            const [documents, total] = await Promise.all([
                Documents.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limitNumber),
                Documents.countDocuments(filter),
            ]);

            res.status(200).json({
                message: 'Danh sách tài liệu',
                data: documents,
                total,
                page: pageNumber,
                limit: limitNumber,
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách tài liệu:', error);
            res.status(500).json({ message: 'Lỗi máy chủ' });
        }
    }

    delete(req, res) {
        const documentId = req.params.documentId;
        Documents.deleteOne({ _id: documentId })
            .then(() => {
                res.status(200).json({
                    message: 'Documents has been force deleted ',
                });
            })
            .catch((error) => {
                console.log('error force delete: ', error);
                res.status(500).json({ message: 'Internal Server Error' });
            });
    }
}
module.exports = new DocumentsController();
