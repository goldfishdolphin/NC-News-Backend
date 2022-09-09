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
            const article_id = 5;
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
        test('200: should return an object with a comments count when ', () => {
            const article_id = 5;
            return request(app)
                .get(`/api/articles/${article_id}`)
                .expect(200)
                .then(({ body }) => {
                    const { article } = body;
                    expect(article).toEqual({
                        article_id: 5,
                        title: 'UNCOVERED: catspiracy to bring down democracy',
                        topic: 'cats',
                        author: 'rogersop',
                        body: 'Bastet walks amongst us, and the cats are taking arms!',
                        created_at: '2020-08-03T13:14:00.000Z',
                        votes: 0,
                        comment_count: 2
                    });
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
        test('400 : responds with an error message when passed a route that is invalid', () => {
            return request(app)
                .get('/api/articles/NotAId')
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe('Bad Request');
                });
        });

    });

    describe('api/users', () => {
        test('200: responds with an array of users', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({ body }) => {
                    const users = body;
                    expect(Array.isArray(users)).toBe(true);
                    expect(users.length > 0);
                    users.forEach(user => {
                        expect(user).toHaveProperty('username');
                        expect(user).toHaveProperty('name');
                        expect(user).toHaveProperty('avatar_url');
                    });
                });
        });

    });
});
describe('Error Handling :Incorrect Path', () => {
    test('404: responds with an error message when passes a route that does not exist ', () => {
        return request(app)
            .get('/api/NotARoute')
            .expect(404)
            .then(({ body }) => {

                expect(body.message).toBe('Path Not Found');
            });
    });

});

describe('PATCH', () => {
    describe('api/articles/:article_id', () => {
        test('200: responds with an updated article when there is an increase in votes', () => {
            const article_id = 3;
            const newVote = 100;
            const votesUpdate = {
                inc_votes: newVote
            };

            return request(app)
                .patch(`/api/articles/${article_id}`)
                .send(votesUpdate)
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toEqual({
                        article_id: 3,
                        title: 'Eight pug gifs that remind me of mitch',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'some gifs',
                        created_at: '2020-11-03T09:12:00.000Z',
                        votes: 100
                    });
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
        test('400 : responds with an error message when passed a route that is invalid', () => {
            return request(app)
                .get('/api/articles/NotAId')
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe('Bad Request');
                });
        });

        test('200: responds with an updated article when there is an decrease in votes', () => {
            const article_id = 3;
            const newVote = -10;
            const votesUpdate = {
                inc_votes: newVote
            };
            return request(app)
                .patch(`/api/articles/${article_id}`)
                .send(votesUpdate)
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toEqual({
                        article_id: 3,
                        title: 'Eight pug gifs that remind me of mitch',
                        topic: 'mitch',
                        author: 'icellusedkars',
                        body: 'some gifs',
                        created_at: '2020-11-03T09:12:00.000Z',
                        votes: -10
                    });
                });
        });

        test('400: responds with error if required fields are missing', () => {
            const article_id = 3;

            const votesUpdate = {};
            return request(app)
                .patch(`/api/articles/${article_id}`)
                .send(votesUpdate)
                .expect(400)
                .expect(({ body }) => {
                    expect(body.message).toBe('Bad Request');
                });

        });
        test('400: responds with error value passed for an update are not valid', () => {
            const article_id = 3;
            const newVote = -10;
            const votesUpdate = {
                inc_votes: 'vote'
            };
            return request(app)
                .patch(`/api/articles/${article_id}`)
                .send(votesUpdate)
                .expect(400)
                .expect(({ body }) => {
                    expect(body.message).toBe('Bad Request');
                });

        });
    });


});