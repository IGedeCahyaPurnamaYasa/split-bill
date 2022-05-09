const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const roleController = require('../../controllers/roleController');
const rolePermissionController = require('../../controllers/rolePermissionController');

router.route('')
    .get(auth, roleController.get)
    .post(auth, roleController.create);

router.route('/:id')
    .get(auth, roleController.getById)
    .patch(auth, roleController.update)
    .delete(auth, roleController.delete);

router.route('/:id/permission')
    .post(auth, rolePermissionController.create);

router.route('/:id/permission/:permission_id')
    .delete(auth, rolePermissionController.delete);
    
module.exports = router;