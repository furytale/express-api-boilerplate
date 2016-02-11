'use strict';
import logger from './helpers/logger';
//import process from 'process';
/* global process */
export default (() => {
    process.on('uncaughtException',
        (exception) => {
            logger.log(
                {error: exception, stack: exception.stack},
                'fatal',
                'error',
                () => process.exit(1)
            );
        }
    );
})();
