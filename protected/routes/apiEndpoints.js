import express from 'express';
import apiServices from '../core/apiServices';
let router = express.Router();

router.route('/:endpoint/:section')
    .post(function (req, res, next) {
        apiServices.requestHandler(req, res, next);
    });

module.exports = router;