const app = require('../app');
const request = require('supertest');
const assert = require('assert');

let token;
describe('Authentication Endpoints', () => {

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password',
        isAdmin:true
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
    //expect(res.body.user).toHaveProperty('email');
    //expect(res.body).toHaveProperty('token');
    //token = res.body.token;
  });

  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    //expect(res.body.user).toHaveProperty('name');
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('isAdmin');
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

});

describe('Group Endpoints', () => {
  let groupId;

  it('should create a new group', async () => {
    const res = await request(app)
      .post('/api/groups')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Group'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    groupId = res.body.id;
  });

  it('should get a list of all groups', async () => {
    const res = await request(app)
      .get('/api/groups')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it('should add a user to a group', async () => {
    const res = await request(app)
      .post(`/api/groups/${groupId}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'johndoe@example.com'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    // expect(res.body.members).toContainEqual(expect.objectContaining({
    //   email: 'janedoe@example.com'
    // }));
  });

  it('should remove a user from a group', async () => {
    const res = await request(app)
      .delete(`/api/groups/${groupId}/members`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: 'johndoe@example.com'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    // expect(res.body.members).not.toContainEqual(expect.objectContaining({
    //   email: 'janedoe@example.com'
    // }));
  });

  it('should delete a group', async () => {
    const res = await request(app)
      .delete(`/api/groups/${groupId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});


