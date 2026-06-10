const Task = require('./Task');
const User = require('./User');
const mongoose = require('mongoose');

class TaskModel {
  
  static async getAll(userId, filters = {}, sort = {}, pagination = {}) {
    const query = { user: new mongoose.Types.ObjectId(userId) };
    const { priority, completed } = filters;

    if (priority !== undefined) {
      query.priority = priority;
    }

    if (completed !== undefined) {
      query.completed = completed;
    }

    
    const totalCount = await Task.countDocuments(query);

    
    const { page = 1, limit = 5 } = pagination;
    const startIndex = (page - 1) * limit;

    
    let pipeline = [{ $match: query }];

    const { sortBy, sortOrder = 'asc' } = sort;
    if (sortBy) {
      const isAsc = sortOrder === 'asc';
      const modifier = isAsc ? 1 : -1;

      if (sortBy === 'createdAt') {
        pipeline.push({ $sort: { createdAt: modifier } });
      } else if (sortBy === 'dueDate') {
        
        pipeline.push(
          {
            $addFields: {
              hasDueDate: { $cond: { if: { $eq: ["$dueDate", null] }, then: 1, else: 0 } }
            }
          },
          {
            $sort: { hasDueDate: 1, dueDate: modifier }
          }
        );
      } else if (sortBy === 'priority') {
        
        pipeline.push(
          {
            $addFields: {
              priorityWeight: {
                $switch: {
                  branches: [
                    { case: { $eq: ["$priority", "low"] }, then: 1 },
                    { case: { $eq: ["$priority", "medium"] }, then: 2 },
                    { case: { $eq: ["$priority", "high"] }, then: 3 }
                  ],
                  default: 2
                }
              }
            }
          },
          {
            $sort: { priorityWeight: modifier }
          }
        );
      }
    } else {
      
      pipeline.push({ $sort: { _id: 1 } });
    }

    
    pipeline.push({ $skip: startIndex });
    pipeline.push({ $limit: limit });

    const results = await Task.aggregate(pipeline);

    
    const tasks = results.map(doc => {
      const id = doc._id.toHexString();
      const mapped = { id, ...doc };
      delete mapped._id;
      delete mapped.priorityWeight;
      delete mapped.hasDueDate;
      delete mapped.__v;
      return mapped;
    });

    return {
      tasks,
      totalCount
    };
  }

  
  static async getById(id, userId) {
    return await Task.findOne({ _id: id, user: userId });
  }

  
  static async create(userId, title, description, priority, dueDate, completed) {
    const newTask = new Task({
      title,
      description: description || '',
      completed: completed === undefined ? false : completed,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      user: userId
    });
    return await newTask.save();
  }

  
  static async update(id, userId, updatedData) {
    
    const { id: _, createdAt: __, user: ___, ...sanitizedUpdates } = updatedData;

    
    return await Task.findOneAndUpdate(
      { _id: id, user: userId },
      sanitizedUpdates,
      { returnDocument: 'after', runValidators: true }
    );
  }

  
  static async delete(id, userId) {
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: userId });
    return !!deletedTask;
  }

  
  static async seedData() {
    try {
      const userCount = await User.countDocuments();
      let seedUser;
      if (userCount === 0) {
        console.log('Seeding default user...');
        seedUser = await User.create({
          email: 'seeduser@example.com',
          password: 'password123'
        });
      } else {
        seedUser = await User.findOne({ email: 'seeduser@example.com' });
        
        if (!seedUser) {
          seedUser = await User.findOne();
        }
      }

      const taskCount = await Task.countDocuments();
      if (taskCount === 0 && seedUser) {
        console.log('Seeding initial tasks connected to default user...');
        await Task.insertMany([
          { 
            title: 'Learn Node.js', 
            description: 'Understand basic Node.js concepts', 
            completed: true,
            priority: 'medium',
            dueDate: null,
            createdAt: new Date('2026-06-01T10:00:00.000Z'),
            updatedAt: new Date('2026-06-01T10:00:00.000Z'),
            user: seedUser._id
          },
          { 
            title: 'Build an Express API', 
            description: 'Build a RESTful API using Express.js MVC pattern', 
            completed: false,
            priority: 'high',
            dueDate: new Date('2026-06-15T12:00:00.000Z'),
            createdAt: new Date('2026-06-02T11:00:00.000Z'),
            updatedAt: new Date('2026-06-02T11:00:00.000Z'),
            user: seedUser._id
          },
          { 
            title: 'Write API Tests', 
            description: 'Implement integration tests with Jest and Supertest', 
            completed: false,
            priority: 'low',
            dueDate: new Date('2026-06-10T09:00:00.000Z'),
            createdAt: new Date('2026-06-03T12:00:00.000Z'),
            updatedAt: new Date('2026-06-03T12:00:00.000Z'),
            user: seedUser._id
          }
        ]);
        console.log('Database seeded successfully.');
      }
    } catch (err) {
      console.error('Error seeding database:', err.message);
    }
  }
}

module.exports = TaskModel;
