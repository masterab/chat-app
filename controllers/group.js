const Group = require('../models/group');
const User = require('../models/user');

exports.createGroup = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existingGroup = await Group.findOne({ name });

    if (existingGroup) {
      return res.status(400).json({ message: 'Group with that name already exists.' });
    }

    const group = new Group({ name });

    await group.save();

    return res.status(201).json({ message: 'Group has been created successfully.',id: group._id });
  } catch (error) {
    return next(error);
  }
};

exports.deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    await group.remove();

    return res.status(200).json({ message: 'Group has been deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};

exports.searchGroups = async (req, res, next) => {
  try {
    const { query } = req.query;

    const groups = await Group.find({ name: new RegExp(query, 'i') });

    return res.status(200).json({ groups });
  } catch (error) {
    return next(error);
  }
};

exports.listGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({});

    return res.status(200).json({ groups });
  } catch (error) {
    return next(error);
  }
};

exports.getGroupMembers = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate('members');

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const members = group.members.map((member) => {
      return {
        email: member.email,
        name: member.name,
        isAdmin: member.isAdmin,
      };
    });

    return res.status(200).json({ members });
  } catch (error) {
    return next(error);
  }
};

exports.addGroupMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (group.members.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a member of the group.' });
    }

    group.members.push(user._id);
    await group.save();

    return res.status(200).json({ message: 'User has been added to the group successfully.' });
  } catch (error) {
    return next(error);
  }
};

exports.removeGroupMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!group.members.includes(user._id)) {
      return res.status(400).json({ message: 'User is not a member of the group.' });
    }

    group.members = group.members.filter((memberId) => memberId.toString() !== user._id.toString());
    await group.save();

    return res.status(200).json({ message: 'User has been removed from the group successfully.' });
  } catch (error) {
    return next(error);
  }
};

exports.getGroupMessages = async (req, res, next)=> {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const messages = group.messages;
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { message } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    const user = req.user;

    const newMessage = {
      text:message,
      createdBy: user.userId,
      likes: []
    };

    group.messages.push(newMessage);
    await group.save();

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    return next(error);
  }
};

exports.likeMessage = async (req, res, next) => {
  const { groupId, messageId } = req.params;
  const userId = req.user.id;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const message = group.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.likes.includes(userId)) {
      return res.status(400).json({ message: 'User has already liked this message' });
    }

    message.likes.push(userId);
    await group.save();

    return res.json({ message: 'Message liked successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

