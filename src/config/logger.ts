import { createLogger, format, transports } from 'winston';
import { LOG_ACCESS_FILE, LOG_ERROR_FILE } from '../config/default';


export const LogColors: { [key: string]: string } = {
    error: '\x1b[31m',  // Red for errors
    warn: '\x1b[33m',   // Yellow for warnings
    info: '\x1b[32m',   // Green for info
    http: '\x1b[36m',   // Cyan for HTTP logs
    debug: '\x1b[35m',  // Magenta for debug logs
    reset: '\x1b[0m'    // Reset color
};


const colorFormat = format.printf(({ timestamp, level, message, statusCode }) => {
    const colorLevel = LogColors[level] || LogColors.reset;
    let coloredStatusCode;


    // Apply color based on the status code
    if (statusCode as any >= 200 && statusCode as any < 300) {
        coloredStatusCode = `${LogColors.info}${statusCode}${LogColors.reset}`; // Green for success
    } else if (statusCode as any >= 400 && statusCode as any < 600) {
        coloredStatusCode = `${LogColors.error}${statusCode}${LogColors.reset}`; // Red for errors
    } else {
        coloredStatusCode = `${LogColors.warn}${statusCode}${LogColors.reset}`; // Yellow for others (e.g., 3xx)
    }
// Return the log with the colored status code only
return `[${LogColors.http}${timestamp}${LogColors.reset}] [${colorLevel}${level.toUpperCase()}${LogColors.reset}]: ${(message as any).replace('$' + statusCode + '$', coloredStatusCode)}`;
});

// Custom format for plain text logs (file output)
const plainTextFormat = format.printf(({ timestamp, level, message, statusCode }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${(message as any).replace('$' + statusCode + '$', statusCode)}`;
});


export const logger = createLogger({
    level: 'debug', // Set the minimum log level (debug, info, warn, error)
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }) // Add timestamp
    ),
    transports: [
        // Console transport: log with LogColors
        new transports.Console({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                colorFormat // Apply colorized format
            )
        }),
        // File transport: log plain text (no LogColors)
        new transports.File({
            filename: LOG_ACCESS_FILE,
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format((info) => {
                    return info.level === 'info' ? info : false; // Only allow 'info' level logs
                })(),
                plainTextFormat // Apply plain text format
            ), level: 'info'
        }),
        // File transport: log plain text (no LogColors)
        new transports.File({
            filename: LOG_ERROR_FILE,
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                plainTextFormat // Apply plain text format
            ), level: 'error'
        })
    ]
});
