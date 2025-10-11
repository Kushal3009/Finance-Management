import winston from "winston";
import path from "path";
import fs from "fs";

// 🧰 1. Ensure logs folder exists
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = process.env.NODE_ENV || "development";
    return env === "development" ? "debug" : "warn";
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "magenta",
    debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => {
        return `[${info.timestamp}] ${info.level}: ${info.message}`;
    })
);

const getLogFileName = (level) => {
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    return path.join(logDir, `${date}-${level}.log`);
};

// 🧰 2. Ensure log files exist
const logFiles = [
    getLogFileName("combined"),
    getLogFileName("error"),
    path.join(logDir, "combined.log"),
    path.join(logDir, "error.log")
];

for (const file of logFiles) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, "");
    }
}

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: getLogFileName("combined"),
    }),
    new winston.transports.File({
        filename: getLogFileName("error"),
        level: "error",
    }),
    new winston.transports.File({ filename: path.join(logDir, "combined.log") }),
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
];

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

export default logger;
