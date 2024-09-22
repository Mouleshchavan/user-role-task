const Task = require('../models/Task');
const User = require('../models/User');


exports.addTask = async (req, res) => {
  const { title, description } = req.body;
  console.log("HELLO")
  const task = new Task({ title, description, user: req.user.id });
  try {
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTasks = async (req, res) => {
    try {
      let tasks;
        if (req.user.role === 'superAdmin') {
        tasks = await Task.find();
      } else if (req.user.role === 'admin') {
        const userIds = await User.find({ role: 'user' }).select('_id');
        tasks = await Task.find({
          $or: [
            { user: req.user.id },
            { user: { $in: userIds.map(user => user._id) } }
          ]
        });
      } else {
        tasks = await Task.find({ user: req.user.id });
      }
  
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error); 
      res.status(400).json({ error: error.message });
    }
  };
  
  
