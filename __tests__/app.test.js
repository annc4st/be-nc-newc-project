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