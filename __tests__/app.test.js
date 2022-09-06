const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET', () => {
    describe('api/topics', () => {
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
    describe('api/articles/:article_id', () => {

        test('200: responds with a single matching article  ', () => {
            const article_id = 2;
            return request(app)
                .get(`/api/articles/${article_id}`)
                .expect(200)
                .then(({ body }) => {
                    expect(typeof body.article).toBe('object');
                    const { article } = body;
                    expect(article).toHaveProperty('author');
                    expect(article).toHaveProperty('title');
                    expect(article).toHaveProperty('article_id');
                    expect(article).toHaveProperty('body');
                    expect(article).toHaveProperty('topic');
                    expect(article).toHaveProperty('created_at');
                    expect(article).toHaveProperty('votes');
                });
        });
        test('404: responds with an error message when passed a route that does not exist ', () => {
            return request(app)
                .get('/api/articles/99999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe('Article not found');
                });
        });
        test.only('400 : responds with an error message when passed a route that is invalid', () => {
            return request(app)
                .get('/api/articles/NotAId')
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe('Invalid ID');
                });
        });
    });
});

