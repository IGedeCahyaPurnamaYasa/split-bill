const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const permission = require('../../middleware/permission')

const permissionController = require('../../controllers/permissionController');


router.route('')
    .get(auth, permission('read-permission'), permissionController.get)
    .post(auth, permission('create-permission'), permissionController.create);

router.route('/:id')
    .get(auth, permission('read-permission'), permissionController.getById)
    .patch(auth, permission('update-permission'), permissionController.update)
    .delete(auth, permission('delete-permission'), permissionController.delete);

module.exports = router;