const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const Bug = require('../models/Bug');

describe('Bug API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Bug.deleteMany();
  });

  it('should create a new bug', async () => {
    const res = await request(app)
      .post('/api/bugs')
      .send({ title: 'Bug 1', description: 'A bug' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Bug 1');
  });

  it('should get all bugs', async () => {
    await Bug.create({ title: 'Bug 1', description: 'A bug' });
    const res = await request(app).get('/api/bugs');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it('should update a bug', async () => {
    const bug = await Bug.create({ title: 'Bug 1', description: 'A bug' });
    const res = await request(app)
      .put(`/api/bugs/${bug._id}`)
      .send({ title: 'Bug 1', description: 'Updated', status: 'resolved' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('resolved');
  });

  it('should delete a bug', async () => {
    const bug = await Bug.create({ title: 'Bug 1', description: 'A bug' });
    const res = await request(app).delete(`/api/bugs/${bug._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Bug deleted');
  });
});
