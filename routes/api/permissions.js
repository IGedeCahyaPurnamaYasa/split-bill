const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const permissionController = require('../../controllers/permissionController');


router.route('')
    .get(auth, permissionController.get)
    .post(auth, permissionController.create);

router.route('/:id')
    .get(auth, permissionController.getById)
    .patch(auth, permissionController.update)
    .delete(auth, permissionController.delete);

module.exports = router;