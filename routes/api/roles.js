const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const permission = require('../../middleware/permission')

const roleController = require('../../controllers/roleController');
const rolePermissionController = require('../../controllers/rolePermissionController');

router.route('')
    .get(auth, permission('read-role'), roleController.get)
    .post(auth, permission('create-role'), roleController.create);

router.route('/:id')
    .get(auth, permission('read-role'), roleController.getById)
    .patch(auth, permission('update-role'), roleController.update)
    .delete(auth, permission('delete-role'), roleController.delete);

router.route('/:id/permission')
    .post(auth, permission('create-role-permission'), rolePermissionController.create);

router.route('/:id/permission/:permission_id')
    .delete(auth, permission('delete-role-permission'), rolePermissionController.delete);
    
module.exports = router;