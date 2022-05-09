const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

const menuTypeController = require('../../controllers/menuTypeController');


router.route('')
    .get(auth, menuTypeController.get)
    .post(auth, menuTypeController.create);

router.route('/:id')
    .get(auth, menuTypeController.getById)
    .patch(auth, menuTypeController.update)
    .delete(auth, menuTypeController.delete);

module.exports = router;