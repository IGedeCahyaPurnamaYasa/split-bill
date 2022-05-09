const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const menuItemController = require('../../controllers/menuItemController');


router.route('')
    .get(auth, menuItemController.get)
    .post(auth, menuItemController.create);

router.route('/:id')
    .get(auth, menuItemController.getById)
    .patch(auth, menuItemController.update)
    .delete(auth, menuItemController.delete);

module.exports = router;