const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const companyController = require('../../controllers/companyController');


router.route('')
    .get(auth, companyController.get)
    .post(auth, companyController.create);

router.route('/:id')
    .get(auth, companyController.getById)
    .patch(auth, companyController.update)
    .delete(auth, companyController.delete);

module.exports = router;