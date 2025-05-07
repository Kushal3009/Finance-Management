import { sequelize } from "../config/dbConnection.js";
import { DataTypes } from "sequelize";

export const salarySchema = sequelize.define("salary", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    total_balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    total_expense: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    current_balance: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    total_saving: {
        type: DataTypes.FLOAT,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'salary',
});