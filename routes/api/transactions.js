const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const permission = require('../../middleware/permission')

const transactionController = require('../../controllers/transactionController');
const transactionItemController = require('../../controllers/transactionItemController');


router.route('')
    .get(auth, permission('read-transaction'), transactionController.get)
    .post(auth, permission('create-transaction'), transactionController.create);

router.route('/:id')
    .get(auth, permission('read-transaction'), transactionController.getById)
    .patch(auth, permission('update-transaction'), transactionController.update)
    .delete(auth, permission('delete-transaction'), transactionController.delete);

router.route('/:id/item')
    .get(auth, permission('read-transaction'), transactionItemController.get)
    .post(auth, permission('create-transaction'), transactionItemController.create);

    
router.route('/:id/item/:id_item')
    .get(auth, permission('read-transaction'), transactionItemController.getById)
    .patch(auth, permission('update-transaction'), transactionItemController.update)
    .delete(auth, permission('delete-transaction'), transactionItemController.delete);

module.exports = router;