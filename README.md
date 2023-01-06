# Twitter API Documentation
### _Included section1, section2 & section3 code from Task1_

## Used node.js Express framwork, mysql for database and jsonwebtoken for authorization

Table of all api endpoints for following
- Creating User
- Authenticating & Aurthorizing User
- CRUD of Tweets
- Thread, Like/Dislike & Retweet
- Includes Tests for auth, user and tweets

## Features

- User can register, login
- Aurtorized user can view tweets lists, single tweet details, create tweet, update and delete tweet
- Aurtorized user can like/dislike tweet, start a thread & retweet

## Configuration
```sh
BASE_URL = http://localhost:3000
Database schemas in peoject dir => /database/db_schema.sql
```
> Note: *mysql server needs to be installed as prerequisite to run in local machine
I have used => https://www.apachefriends.org/

## .Env
```sh
SECRET_KEY = 'secret_token_hash'
*Including .env file in project sake of simplicity
```
## Endpoints
User will get token once successfully logged in then after,
Every request should contains `Bearer token in Authorization header` in order to access further resources, Unauthorized user won't access any endpoint except register

| API Endpoint | Description |
| ------ | ------ |
| GET / | Welcome Route |
| POST /user/register | User Registration |
| POST /auth/login | User Login for Authentication & Authorization |
| GET /tweets | Get all Relevant Tweets |
| POST /tweets | Create a Tweet |
| GET /tweets/id | Get Relevant Tweet Details |
| PATCH /tweets/id | Update a Tweet |
| DELETE /tweets/id | Delete a Tweet |
| POST /tweets/id/thread | Start a Tread from existing Tweet |
| POST /tweets/id/retweet | Retweet existing Tweet |
| PATCH /tweets/id/like | Like/Dislike Toggle Tweet |

## Installation & Running
first copy project in local machine: 
```sh
git clone 'git_http_url'
```

Install dependancies:

```sh
npm install 
```

Start Project by:

```sh
npm start
```
Run Test using:

```sh
npm test
```
