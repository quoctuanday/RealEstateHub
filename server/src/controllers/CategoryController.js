const Category = require('../models/Category');
const PostCategory = require('../models/PostCategory');

class CategoryController {
    async create(req, res) {
        const { name, childCate } = req.body.data;

        try {
            const parentCategory = new Category({
                name: name,
            });
            await parentCategory.save();

            const childCategories = childCate.map((childName) => {
                return new Category({
                    name: childName,
                    parentId: parentCategory._id,
                });
            });

            await Category.insertMany(childCategories);

            res.status(201).json({
                message: 'Categories created successfully',
                parentCategory: parentCategory,
                childCategories: childCategories,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error creating categories',
                error,
            });
        }
    }

    async get(req, res) {
        try {
            const categories = await Category.find({ parentId: null })
                .lean()
                .exec();

            const result = await Promise.all(
                categories.map(async (category) => {
                    const childCategories = await Category.find({
                        parentId: category._id,
                    })
                        .lean()
                        .select('name');

                    return {
                        _id: category._id,
                        name: category.name,
                        isActive: category.isActive,
                        childCate: childCategories.map((child) => child.name),
                    };
                })
            );

            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error fetching categories',
                error,
            });
        }
    }

    async update(req, res) {
        const data = req.body.data;
        const categoryId = req.params.id;

        try {
            // Cập nhật tên danh mục nếu có
            const updatePayload = {};
            if (data.name !== undefined) updatePayload.name = data.name;
            if (data.isActive !== undefined)
                updatePayload.isActive = data.isActive;

            const updatedCategory = await Category.findByIdAndUpdate(
                categoryId,
                updatePayload,
                { new: true }
            );

            if (!updatedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            // Nếu không có childCate thì bỏ qua xử lý danh mục con
            const childCateArray = Array.isArray(data.childCate)
                ? data.childCate
                : null;
            if (childCateArray) {
                const currentChildCategories = await Category.find({
                    parentId: categoryId,
                });

                // Xóa các child category không có trong childCate mới
                const childCateSet = new Set(childCateArray);
                const childCategoryIdsToDelete = currentChildCategories
                    .filter((child) => !childCateSet.has(child.name))
                    .map((child) => child._id);

                if (childCategoryIdsToDelete.length > 0) {
                    await PostCategory.deleteMany({
                        categoryId: { $in: childCategoryIdsToDelete },
                    });

                    await Category.deleteMany({
                        _id: { $in: childCategoryIdsToDelete },
                    });
                }

                // Tạo mới các child category chưa tồn tại
                for (const childCate of childCateArray) {
                    const existingChild = await Category.findOne({
                        name: childCate,
                        parentId: categoryId,
                    });
                    if (!existingChild) {
                        const newChild = new Category({
                            name: childCate,
                            parentId: categoryId,
                        });
                        await newChild.save();
                    }
                }
            }

            res.status(200).json({ message: 'Category updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Interval Server error',
                error: err.message,
            });
        }
    }
}

module.exports = new CategoryController();
