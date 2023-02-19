const express = require('express');

const router = express.Router();

const { createGroup, deleteGroup, listGroups, searchGroups, addGroupMember, removeGroupMember, getGroupMessages, sendMessage, likeMessage } = require('../controllers/group');
const { verifyToken } = require('../middlewares/auth');

router.post('/', verifyToken, createGroup);
router.delete('/:groupId', verifyToken, deleteGroup);
router.get('/', verifyToken, listGroups);
router.get('/search', verifyToken, searchGroups);
router.post('/:groupId/members', verifyToken, addGroupMember);
router.delete('/:groupId/members', verifyToken, removeGroupMember);
router.get('/:groupId/messages', verifyToken, getGroupMessages);
router.post('/:groupId/messages', verifyToken, sendMessage);
router.put('/:groupId/messages/:messageId/like', verifyToken, likeMessage);

module.exports = router;