const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const discountController = require('../../controllers/discountController');


router.route('')
    .get(auth, discountController.get)
    .post(auth, discountController.create);

router.route('/:id')
    .get(auth, discountController.getById)
    .patch(auth, discountController.update)
    .delete(auth, discountController.delete);

module.exports = router;