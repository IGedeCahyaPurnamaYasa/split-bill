const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const permission = require('../../middleware/permission')

const discountController = require('../../controllers/discountController');


router.route('')
    .get(auth, permission('read-discount'), discountController.get)
    .post(auth, permission('create-discount'), discountController.create);

router.route('/:id')
    .get(auth, permission('read-discount'), discountController.getById)
    .patch(auth, permission('update-discount'), discountController.update)
    .delete(auth, permission('delete-discount'), discountController.delete);

module.exports = router;