const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const permission = require('../../middleware/permission')

const menuItemController = require('../../controllers/menuItemController');


router.route('')
    .get(auth, permission('read-menu-item'), menuItemController.get)
    .post(auth, permission('create-menu-item'), menuItemController.create);

router.route('/:id')
    .get(auth, permission('read-menu-item'), menuItemController.getById)
    .patch(auth, permission('update-menu-item'), menuItemController.update)
    .delete(auth, permission('delete-menu-item'), menuItemController.delete);

module.exports = router;