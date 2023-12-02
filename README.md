# Northcoders News API

### Description
This project mimics the real world service such as Reddit.
Users are able to view topics, read articles and post articles and comments.

### Hosted Version
https://nc-news-proj.onrender.com


- On this project I have practised:
- Querying a database.
- Using a TDD approach to cover both the happy and error paths.
- Setting a RESTful API with a number of endpoints which cover CRUD operations.
- Setting up parametric endpoints.
- Handling complex queries.
- Manipulating data to respond to client requirements.
- Hosting your server and DB.

This API is now ready to be consumed by a Front End project, or to be queried by other APIs and applications.

**The main endpoints are:**
> '/api' 
> '/api/topics'
> '/api/articles/:article_id'
> '/api/articles'
> '/api/articles/:article_id/comments'
> '/api/articles/:article_id/comments'
> '/api/articles/:article_id'
> '/api/comments/:comment_id'
> '/api/users'

The database is PSQL for this project.

### Installation
To run this project locally, follow these steps:
1. Clone the repository:
> git clone https://github.com/annc4st/be-nc-news-project.git
2. Switch into project directory
> cd be-nc-news-project 
3. Install project dependencies:
> npm install

### Database Setup
You will need to set up a local PostgreSQL database and configure the project to use it. Follow these steps:

1. Create a PostgreSQL database with a name of your choice.

2. Create a **.env ** files in the project root directory with the following content:
- **.env.development** file in the project root directory for development with the following content:
> PGDATABASE=nc_news

- **.env.test** file in the project root directory for testing with the following content:
>PGDATABASE=nc_news_test

- **.env.production** 
> DATABASE_URL=postgres://bpqwqlct:xesQyGOz6_OWQvmof9LGB8PrBimE9vpI@tai.db.elephantsql.com/bpqwqlct
 
### Running Tests
To run the project's tests, use the following command:
> npm test app

### Requirements
To run this project, you need the following minimum versions:

- **Node.js** (v17.9.1)
- **PostgreSQL** (v14.9)
- **Express** (4.18.2)

### List of devdependencies and dependencies from the package.json file:

 ```javascript

   "devDependencies": {
    "husky": "^8.0.2",
    "jest": "^27.5.1",
    "jest-extended": "^2.0.0",
    "jest-sorted": "^1.0.14",
    "supertest": "^6.3.3"
  },
  "dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "pg-format": "^1.0.4",
    "pg": "^8.7.3"
  }

