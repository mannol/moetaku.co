const _ = require('lodash');
const winston = require('winston');

const toErrorObject = (error) =>
    _.assign(_.pick(error, ['message', 'stack']), error);

const errorFormat = winston.format((info) => {
    if (info instanceof Error) {
        return toErrorObject(info);
    }

    if (info.message instanceof Error) {
        info.message = toErrorObject(info.message);
    }

    return info;
});

winston.configure({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                errorFormat(),
                winston.format.colorize(),
                winston.format.printf(
                    (info) => `${info.level}: ${info.message}`,
                ),
            ),
        }),
    ],
});

require('./proxy');
