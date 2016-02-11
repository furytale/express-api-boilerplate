import fs from 'fs';
import path from 'path';
import errorService from './errorHandler';
import logger from './helpers/logger';
import _ from 'lodash';

const MODEL_DIR = '../controllers';
const ERR_RESPONSE = {
    status: false,
    error: true,
    message: 'Internal error'
};

class apiServices {

    constructor () {}

    requestHandler (requestObject, responseObject, next) {
        requestObject._startTime = +new Date();
        const serviceName        = requestObject.params.endpoint;
        const functionName       = requestObject.params.section;
        const self               =  this;
        const serviceData        = {serviceName, functionName};
        const routerData         = {requestObject, responseObject};
        this.__loadService(serviceData, function (service) {
            service[serviceData.functionName](routerData, self.__responseHandler(routerData, next));
        });
    }

    __responseHandler ({requestObject, responseObject}, exception) {
        const that = this;
        return (responseCode, responseData, isString) =>
        {
            this.__loggerHandler({requestObject, responseCode, responseData}, exception);
            if (responseData instanceof Error) {
                return that._errorResponse(responseData, responseObject);
            }
            return isString ? responseObject.status(responseCode).send(responseData) :
                                responseObject.status(responseCode).json(responseData);
        }
    }

    _errorResponse (responseData, responseObject) {
        responseObject.status(responseData.errorCode).json(ERR_RESPONSE);
    }

    __loadService ({serviceName, functionName}, callback) {
        const filePath = path.join(__dirname, MODEL_DIR, serviceName + '.js') ;
        fs.exists(filePath, function(exists) {
            if (exists) {
                let service = require(filePath);
                if (typeof(service[functionName]) === 'undefined') {
                    throw new errorService('Function not fount', 'DEFAULT');
                }
                callback(service);
            } else {
                throw new errorService('File not found ' + filePath, 'DEFAULT');
            }
        });
    }

    __loggerHandler ({requestObject, responseCode, responseData}, exception) {
        const startTime = requestObject._startTime;
        const endTime   = new Date();
        var logEntry  = {
            requestIps: _.union(requestObject.ips, requestObject.ip),
            requestPath: requestObject.path,
            requestUser: requestObject.user,
            requestIsXHR: requestObject.xhr,
            requestBody: JSON.stringify(requestObject.body),
            responseCode: responseCode,
            responseObject: JSON.stringify(responseData),
            responseDuration: endTime - startTime
        };
        if (exception && typeof(exception) !== 'undefined') {
            logEntry.exceptionCode = exception.code;
            logEntry.exceptionStack = exception.stack;
        }
        logger.log(logEntry, 'request', 'info');
    }

}

module.exports = new apiServices();