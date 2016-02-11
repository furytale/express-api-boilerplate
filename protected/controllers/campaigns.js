import fs from 'fs';
import path from 'path';
import errorService from '../core/errorHandler';
import axios from 'axios';

class Campaign {
    constructor () {
    }

    load ({requestObject, responseObject}, responseCallback) {
        const content = {foo: 'bar'};
        if (!content) {
            responseCallback( new errorService('DEFAULT'));
        }
        const callback = () => {
            responseCallback(200, content, true)
        }
        setTimeout(callback, 1000);
    }
}

module.exports = new Campaign();