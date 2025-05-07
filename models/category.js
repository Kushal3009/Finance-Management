import { sequelize } from "../config/dbConnection.js";
import { DataTypes } from "sequelize";

export const category = sequelize.define("category", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'category',
})