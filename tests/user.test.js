const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = require('../app');
require('dotenv').config();

const { generateAccessToken, authenticateToken } = require('../middleware/auth');
const token_secret = process.env.SECRET_KEY;

chai.use(chaiHttp);
const expect = chai.expect;

let test = {
    userName: 'newuser',
    password: 'password'
}

describe('User', () => {
  describe('POST /register', () => {
    it('should create a new user if the registration is successful', async () => {
      const res = await chai.request(app)
        .post('/user/register')
        .send({ username: test.userName, password: test.password });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message', 'User created');
    });

    it('should return a 400 Bad Request error if the request is invalid', async () => {
      const res = await chai.request(app)
        .post('/user/register')
        .send({ username: test.userName });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'Invalid request');
    });
  });
});