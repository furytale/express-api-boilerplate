'use strict';
import logger from './helpers/logger.js';
import util from 'util';

/**
 * Using for overwrite error data, in case of given custom string or object
 * @param errorObj
 * @returns {*}
 */
let extendError  = (errorObj) => {
    if (errorObj) {
        if (typeof errorObj === 'string' || errorObj instanceof String) {
            return errorObj;
        }

        let hasOwn = Object.prototype.hasOwnProperty;
        let keys   = [];
        for (let k in errorObj) hasOwn.call(errorObj, k) && typeof errorObj[k] !== 'function' && keys.push(k);
        if (keys.length && (errorObj['toString'] === undefined || errorObj.toString() === '[object Object]'))
        {
            errorObj.toString = () => {
                let result = '';
                for (let key in keys) {
                    result += this[keys[key]];
                }
                return result;
            }
            return errorObj;
        }
    }
    return '';
};

/**
 * Used by errorExceptionHandler, to log error data and return response.
 * @type {{errorResponse: Function, logErrData: Function}}
 */
let errorRequestHandler = {
    errorResponse : function (responseData, requestObject, responseObject) {
        const responseMode = process.env.NODE_ENV === 'production'
        var exceptionOutput = {
            code    : responseData.httpCode,
            message : responseData.message
        };
        errorRequestHandler.logErrData(responseData.logData);

        if (process.env.NODE_ENV === 'production') {
            responseObject.status(responseData.outputCode).json(exceptionOutput);
        } else {
            responseObject.send('<html><body><pre>' + JSON.stringify(exceptionOutput) + '</pre></body></html>');
        }
    },

    logErrData : function (logData) {
        const defApp = process.env.APPLICATION || 'nodeApp';
        logger.log(logData, defApp, 'error');
    }
};

let ErrorDataHandler = () => {
    const constant = {
        DEFAULT : 'unhandled exception code (%s)'
    };

    this.getDefaultData = (instCode, errObj, params) => {
        errObj.httpCode  = 500;
        errObj.message   = util.format(
            constant.DEFAULT,
            errObj.httpCode
        );
        return this.setLogData(instCode, errObj, params);
    };

    this.setLogData = (instCode, errObj, params) => {
        errObj.logData = {
            handlerCode : instCode,
            code        : errObj.errorCode ? errObj.errorCode : errObj.code,
            httpCode    : errObj.httpCode,
            text        : errObj.text || errObj.message,
            stack       : errObj.stack,
            params      : params
        };
        return errObj;
    };
};

let errorSwitchHandler = (code, errObj, requestObject) => {
    var handler = new ErrorDataHandler();
    switch (code) {
        default:
            errObj = handler.getDefaultData('DEFAULT', errObj);
            break;
    }
    errObj.outputCode = (errObj.httpCode === 500) ? 500 : 400;
    return errObj;
};

/**
 * Default throw 'errorHandler', overrides exceptions with a custom params.
 * Return a custom error object.
 * @param error
 * @param code
 * @param params
 * @returns {Error}
 */
module.exports = (error, code, params) => {
    error               = extendError(error);
    params              = params ? params : {};
    let errObj          = new Error(error.toString());
    errObj.errorCode    = 400;
    errObj.text         = error.toString();
    errObj.params       = params;
    errObj.handlerCode  = code;
    return errObj;
};

/**
 * Expressjs custom error handler, receives exceptions, previously overwritten in the custom 'errorHandler'
 * Returns response with exception and logs it.
 * @param error
 * @param requestObject
 * @param responseObject
 * @param next
 */
module.exports.errorExceptionHandler = (error, requestObject, responseObject, next) => {
    error = errorSwitchHandler(error.handlerCode || error.code, error, requestObject);
    errorRequestHandler.errorResponse(error, requestObject, responseObject);
};

module.exports.errorRequestHandler = errorRequestHandler;