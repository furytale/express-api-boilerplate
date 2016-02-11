import winston from 'winston';
import config from '../config/logger';
/**
 * For logging error data, requests data, db data.
 * Simply call the `log` method
 */
class Logger {
    constructor () {
        const LogstashUDP = require('winston-logstash-udp').LogstashUDP;

        this.logger = new (winston.Logger)({
            transports: [
                new LogstashUDP({
                    port: config.port,
                    appName: config.appName,
                    host: config.host
                }),
                new winston.transports.Console()
            ]
        });
    }

    /**
     * Start logging with this method
     * @param logEntry, data to log
     * @param key, application key
     * @param id, identifier, referencing to winston methods(`info`, `error` etc..)
     */
    log (logEntry, key, id, callback) {
        let loggerId = '';
        switch (id) {
            case 'error':
                loggerId = 'error';
                break;
            default:
                loggerId = 'info';
        }
        this.logger[loggerId](key, logEntry, callback);
    }
}

module.exports = new Logger();