const mongoose = require('mongoose');

const db = async () => {
  try {
    await mongoose.connect('mongodb+srv://mouleshchavan:TJwawVLK0kxEolAe@cluster0.a5qb2.mongodb.net/user-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = db;
