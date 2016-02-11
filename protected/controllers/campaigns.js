import fs from 'fs';
import path from 'path';
import errorService from '../core/errorHandler';
import axios from 'axios';
import campaign from '../models/campaign';

class Campaign {
    constructor () {
    }

    load ({requestObject, responseObject}, responseCallback) {
        const content = new campaign();
        if (!content) {
            responseCallback( new errorService('DEFAULT'));
        }
        const callback = () => {
            responseCallback(200, content, false)
        }
        setTimeout(callback, 1000);
    }
}

module.exports = new Campaign();