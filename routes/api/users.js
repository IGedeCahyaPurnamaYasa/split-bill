const express = require('express');
const router = express.Router();
const catchAsync = require('../../utils/catchAsync');
const auth = require('../../middleware/auth')


const userController = require('../../controllers/userController');
const userRoleController = require('../../controllers/userRoleController');

router.route('')
    .post(userController.register);

router.route('/:id')
    .get(userController.get);

router.route('/login')
    .post(userController.login);

router.route('/logout')
    .post(auth, userController.logout);

router.route('/logout-all')
    .post(auth, userController.logoutAll);

router.route('/:id/role')
    .post(auth, userRoleController.create);

router.route('/:id/role/:role_id')
    .delete(auth, userRoleController.delete);

module.exports = router;