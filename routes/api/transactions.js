const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const transactionController = require('../../controllers/transactionController');
const transactionItemController = require('../../controllers/transactionItemController');


router.route('')
    .get(auth, transactionController.get)
    .post(auth, transactionController.create);

router.route('/:id')
    .get(auth, transactionController.getById)
    .patch(auth, transactionController.update)
    .delete(auth, transactionController.delete);

router.route('/:id/item')
    .get(auth, transactionItemController.get)
    .post(auth, transactionItemController.create);

    
router.route('/:id/item/:id_item')
    .get(auth, transactionItemController.getById)
    .patch(auth, transactionItemController.update)
    .delete(auth, transactionItemController.delete);

module.exports = router;