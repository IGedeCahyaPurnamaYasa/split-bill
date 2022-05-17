const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const permission = require('../../middleware/permission')

const menuTypeController = require('../../controllers/menuTypeController');


router.route('')
    .get(auth, permission('read-menu-type'), menuTypeController.get)
    .post(auth, permission('create-menu-type'), menuTypeController.create);

router.route('/:id')
    .get(auth, permission('read-menu-type'), menuTypeController.getById)
    .patch(auth, permission('update-menu-type'), menuTypeController.update)
    .delete(auth, permission('delete-menu-type'), menuTypeController.delete);

module.exports = router;