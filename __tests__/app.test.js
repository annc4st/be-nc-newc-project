const app = require('../db/app');
const db = require('../db/connection');

const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index');
const {getTopics} = require('../controllers/controllers.js');



beforeEach(() =>{
    return seed({ articleData, commentData, topicData, userData })
    })
afterAll(() => {
    db.end()
})

describe('General testing', () => {
    test('should return 404 if path spelt wrong or does not exist', () =>{
        return request(app)
        .get('/api/not-existing-path')
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe('path is not found')
        })
    });
})

describe('GET /api/topics', () =>{
    test('responds with status 200 and array of topics', () =>{
        return request(app)
        .get('/api/topics')
        .expect(200)
    
        .then(({body}) => {
            expect(body.topics).toHaveLength(3)
            body.topics.forEach((topic) => {
                expect(typeof(topic.description)).toBe('string');
                expect(typeof(topic.slug)).toBe('string')
            })
        })
    });
})
/*3*/
describe('GET /api/', () =>{
    test('responds with status 200 and object of available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
           
            expect(typeof(body)).toBe('object')
            //dynamically test all endpoints and their descriptions 
            for (const [endpoint, info] of Object.entries(body)) {
                expect(info.description).toBeDefined();
            }

        })
    })
});

//4
describe('GET /api/articles/:article_id', () => {
    test('responds with status 200 and with article object', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {    
      
            expect(body.article.article_id).toBe(1)
            expect(body.article.title).toBe("Living in the shadow of a great man" )
            expect(body.article.topic).toBe("mitch")
            expect(body.article.author).toBe("butter_bridge")
            expect(body.article.body).toBe("I find this existence challenging")
            expect(body.article.created_at).toBe('2020-07-09T20:11:00.000Z' )
            expect(body.article.votes).toBe(100)
            expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
           
        })
    });

    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/111111')
          .expect(404)
          .then(({body}) => {
            expect(body.message).toBe('item does not exist');
          });
      });
      test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-an-article_id')
          .expect(400)
          .then((response) => {
            expect(response.body.message).toBe("Invalid input syntax");
        });
    });
});

//5
describe.only('GET /api/articles responds with array of articles', () => {
    test('GET:200 sends an appropriate status and article array', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            
            expect(body.articles).toHaveLength(13)

            body.articles.forEach((article) => {
                expect(typeof(article.article_id)).toBe('number')
                expect(typeof(article.title)).toBe('string')
                expect(typeof(article.author )).toBe('string')
                expect(typeof(article.topic )).toBe('string')
                expect(typeof(article.created_at )).toBe('string')
                expect(typeof(article.votes)).toBe('number')
                expect(typeof(article.article_img_url)).toBe('string')
                expect(typeof(article.comment_count)).toBe('string')
            })
        })
    });
    test('articles should be ordered in descending order by created_at',  () => {
        return request(app)
        .get('/api/articles')
        .then(({body}) => {      
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    });

    test('should return 404 if articles spelt wrong', () =>{
        return request(app)
        .get('/api/articles-spelt-wrong')
        .expect(404)
        .then((response) => {
            expect(response.body.message).toBe('path is not found')
        })
    });
})

