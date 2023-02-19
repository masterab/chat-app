const express = require('express');

const router = express.Router();

const { createUser, editUser } = require('../controllers/admin');
const { verifyToken, isAdmin } = require('../middlewares/auth');

router.post('/users', verifyToken, isAdmin, createUser);
router.put('/users/:userId', verifyToken,isAdmin, editUser);

module.exports = router;