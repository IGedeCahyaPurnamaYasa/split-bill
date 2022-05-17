const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const permission = require('../../middleware/permission')

const splitbillController = require('../../controllers/splitbillController');
const splitbillItemController = require('../../controllers/splitbillItemController');


router.route('')
    .get(auth, permission('read-splitbill'), splitbillController.get)
    .post(auth, permission('create-splitbill'), splitbillController.create);

router.route('/:id')
    .get(auth, permission('read-splitbill'), splitbillController.getById)
    .patch(auth, permission('update-splitbill'), splitbillController.update)
    .delete(auth, permission('delete-splitbill'), splitbillController.delete);

router.route('/:id/item')
    .get(auth, permission('read-splitbill'), splitbillItemController.get)
    .post(auth, permission('create-splitbill'), splitbillItemController.create);

    
router.route('/:id/item/:id_item')
    .get(auth, permission('read-splitbill'), splitbillItemController.getById)
    .patch(auth, permission('update-splitbill'), splitbillItemController.update)
    .delete(auth, permission('delete-splitbill'), splitbillItemController.delete);

module.exports = router;