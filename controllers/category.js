import { sequelize } from "../config/dbConnection.js"
import { category } from "../models/category.js";

export const fetchCategorys = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const categorys = await category.findAll(
            {
                attributes: ['id', 'category_name'],
            }
        );
        if (categorys.length === 0) {
            res.status(200).json({
                statusCode: 200,
                status: true,
                message: "No category found",
                data: []
            })
        }

        await transaction.commit();
        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Category fetched successfully",
            data: categorys
        })
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            statusCode: 500,
            status: false,
            message: "Error fetching category",
            error: error.message
        })
    }
}