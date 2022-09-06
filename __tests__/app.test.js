const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('api/topics', () => {
    describe('GET', () => {
        test('200: responds with an array of topics ', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    expect(body.topic.length > 0).toBe(true);
                    const { topic } = body;
                    expect(Array.isArray(topic)).toBe(true);
                    topic.forEach(topic => {
                        expect(topic).toHaveProperty('slug');
                        expect(topic).toHaveProperty('description');
                    });
                });
        });
        test('404: responds with an error message when passes a route that does not exist ', () => {
            return request(app)
                .get('/api/NotARoute')
                .expect(404)
                .then(({ body }) => {

                    expect(body.message).toBe('Path Not Found');
                });
        });
    });
});
