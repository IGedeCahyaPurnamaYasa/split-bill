const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const splitbillController = require('../../controllers/splitbillController');
const splitbillItemController = require('../../controllers/splitbillItemController');


router.route('')
    .get(auth, splitbillController.get)
    .post(auth, splitbillController.create);

router.route('/:id')
    .get(auth, splitbillController.getById)
    .patch(auth, splitbillController.update)
    .delete(auth, splitbillController.delete);

router.route('/:id/item')
    .get(auth, splitbillItemController.get)
    .post(auth, splitbillItemController.create);

    
router.route('/:id/item/:id_item')
    .get(auth, splitbillItemController.getById)
    .patch(auth, splitbillItemController.update)
    .delete(auth, splitbillItemController.delete);

module.exports = router;