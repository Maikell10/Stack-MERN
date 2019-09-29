const { Router } = require('express');
const router = Router();

const { getUsers, getUser, createUsers, deleteUsers, updateUsers } = require('../controllers/user.controller');

router.route('/')
    .get(getUsers)
    .post(createUsers)

router.route('/:id')
    .get(getUser)
    .put(updateUsers)
    .delete(deleteUsers)

module.exports = router;