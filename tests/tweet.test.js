const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
require('dotenv').config();

const { generateAccessToken, authenticateToken } = require('../middleware/auth');
const token_secret = process.env.SECRET_KEY;

chai.use(chaiHttp);
const expect = chai.expect;

let test = {
    userId: '359fbdc2-4ba7-4fdd-9456-3854d9c72381',
    tweetId: '606926a7-d37c-4600-9d41-4647c8ad75a8',
    userName: 'testuser',
    password: 'password',
};

describe('Tweet routes', () => {
  let authToken;

  before((done) => {
    // Create a user and get an auth token for the tests
    request(app)
      .post('/auth/login')
      .send({ username: test.userName, password: test.password })
      .end((err, res) => {
        authToken = res.body.token;
        done();
      });
  });

  describe('GET /tweets', () => {
    it('should return an array of tweets for the authenticated user', (done) => {
      request(app)
        .get('/tweets')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.have.property('tweet_id');
          expect(res.body[0]).to.have.property('title');
          expect(res.body[0]).to.have.property('description');
          expect(res.body[0]).to.have.property('user_id');
          expect(res.body[0]).to.have.property('status');
          expect(res.body[0]).to.have.property('created_at');
          expect(res.body[0]).to.have.property('updated_at');
        })
        .end(done);
    });
  });

  describe('GET /tweets/:id', () => {
    it('should return a single tweet for the authenticated user', (done) => {
      request(app)
        .get(`/tweets/${test.tweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('tweet_id');
          expect(res.body).to.have.property('title');
          expect(res.body).to.have.property('description');
          expect(res.body).to.have.property('user_id');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('created_at');
          expect(res.body).to.have.property('updated_at');
        })
        .end(done);
    });
  
    it('should return a 404 status code and an error message if the tweet is not found', (done) => {
      request(app)
        .get('/tweets/1000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error').that.is.a('string');
        })
        .end(done);
    });
  });

  describe('POST /tweets', () => {
    it('should create a new tweet and return a 201 status code', (done) => {
      request(app)
        .post('/tweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test tweet', description: 'This is a test tweet' })
        .expect(201)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.is.a('string');
        })
        .end(done);
    });
  
    it('should return a 400 status code and an error message if the request is missing a required field', (done) => {
      request(app)
        .post('/tweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test tweet' })
        .expect(400)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error').that.is.a('string');
        })
        .end(done);
    });
  });

  describe('PATCH /tweets/:id', () => {
    it('should update a tweet and return a 200 status code', (done) => {
      request(app)
        .patch(`/tweets/${test.tweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated tweet' })
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.is.a('string');
        })
        .end(done);
    });
  
    it('should return a 404 status code and an error message if the tweet is not found', (done) => {
      request(app)
        .patch('/tweets/1000')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated tweet' })
        .expect(404)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error').that.is.a('string');
        })
        .end(done);
    });
  });

  describe('DELETE /tweets/:id', () => {
    it('should delete a tweet and return a 200 status code', (done) => {
      request(app)
        .delete(`/tweets/${test.tweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message').that.is.a('string');
        })
        .end(done);
    });
  
    it('should return a 404 status code and an error message if the tweet is not found', (done) => {
      request(app)
        .delete('/tweets/1000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error').that.is.a('string');
        })
        .end(done);
    });
  });
});