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
    userId: 'dbb3c2d0-ad9c-4826-845a-f91ec3cde545',
    userName: 'testuser',
    password: 'password',
    wrongPassword: 'wrongpassword',
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNTlmYmRjMi00YmE3LTRmZGQtOTQ1Ni0zODU0ZDljNzIzODEiLCJ1c2VyTmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNjczMDM0NTE5LCJleHAiOjM2MTY3MzAzNDUxOX0.NfRMQgNV51RKVTQL1n4I3hsd_y-zqkmyay4JlgLB8gQ',
    inValidToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNTlmYmRjMi00YmE3LTRmZGQtOTQ1Ni0zODU0ZDljNzIzODEiLCJ1c2VyTmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNjczMDM0NTE5LCJleHAiOjM2MTY3MzAzNDUxOX0.NfRMQgNV51RKVTQL1n4I3hsd_y-zqkmyay4JlgLB8'
}

describe('Auth', () => {
  describe('POST /auth/login', () => {
    it('should return a JSON web token if the login is successful', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({ username: test.userName, password: test.password });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });

    it('should return a 401 Unauthorized error if the login is unsuccessful', async () => {
      const res = await chai.request(app)
        .post('/auth/login')
        .send({ username: test.userName, password: test.wrongPassword });
      expect(res).to.have.status(401);
      expect(res.body).to.have.property('message', 'Invalid credentials');
    });
  });

  describe('generateAccessToken', () => {
    it('should generate a valid JSON web token', () => {
      const token = generateAccessToken({ userId: test.userId, userName: test.userName });
      jwt.verify(token, token_secret, (err, decoded) => {
        expect(decoded).to.have.property('userId', test.userId);
      });
    });
  });

  describe('authenticateToken', () => {
    it('should pass execution to the next middleware if the token is valid', (done) => {
      const req = { headers: { authorization: test.token } };
      const res = {};
      authenticateToken(req, res, done);
    });
  });
});