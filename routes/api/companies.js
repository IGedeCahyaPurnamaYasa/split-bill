const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const permission = require('../../middleware/permission')

const companyController = require('../../controllers/companyController');


router.route('')
    .get(auth, permission('read-company'), companyController.get)
    .post(auth, permission('create-company'), companyController.create);

router.route('/:id')
    .get(auth, permission('read-company'), companyController.getById)
    .patch(auth, permission('update-company'), companyController.update)
    .delete(auth, permission('delete-company'), companyController.delete);

module.exports = router;