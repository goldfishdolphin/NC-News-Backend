const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('API', () => {
    test('200: responds with the list of all apis on the app', () => {
        return request(app)
            .get('/')
            .expect(200)
            .then(({ body }) => {
                expect.objectContaining({
                    "GET /api": expect.any(Object),
                    "GET /api/topics": expect.any(Object),
                    "GET /api/articles": expect.any(Object),
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
    describe('api/articles', () => {
        test('200: responds with an array of users ', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then((response) => {
                    const { body } = response;
                    const { articles } = body;
                    expect(Array.isArray(articles)).toBe(true);
                    articles.forEach(article => {
                        expect(article).toHaveProperty('author');
                        expect(article).toHaveProperty('title');
                        expect(article).toHaveProperty('article_id');
                        expect(article).toHaveProperty('topic');
                        expect(article).toHaveProperty('created_at');
                        expect(article).toHaveProperty('votes');
                        expect(article).toHaveProperty('comment_count');
                    });
                    expect(articles.length).toBe(12);

                });

        });
        test('200: responds with an array of users which is sorted by date', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;

                    expect(articles).toBeSortedBy('created_at', { descending: true });
                });
        });
        test('200: responds with an array sorted by title in descending order', () => {
            return request(app)
                .get('/api/articles?sort_by=title')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles).toBeSortedBy('title', { descending: true });
                });
        });
        test('200: responds with an array sorted by author in descending order', () => {
            return request(app)
                .get('/api/articles?sort_by=author')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles).toBeSortedBy('author', { descending: true });
                });
        });
        test('200: responds with an array sorted by votes in descending order', () => {
            return request(app)
                .get('/api/articles?sort_by=votes')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles).toBeSortedBy('votes', { descending: true });
                });
        });
        test('200: responds with all the articles of a certain topic', () => {
            return request(app)
                .get('/api/articles?topic=cats')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles.length).toBe(1);
                });
        });
        test('200: responds with array in ascending order by date created when a query with ascending order is passed  ', () => {
            return request(app)
                .get(`/api/articles?order=asc`)
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles).toBeSortedBy('created_at', { descending: false });

                });
        });
        test('200: responds wth an array of object when 2 queries are passed  ', () => {
            return request(app)
                .get(`/api/articles?order=asc&sort_by=title`)
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;
                    expect(articles).toBeSortedBy('title', { descending: false });
                });
        });
        test('404: responds with an error when topic passed in the query does not exist', () => {
            return request(app)
                .get('/api/articles?topic=dog')
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe('Topic does not exist');
                });
        });
        test('400: responds with an error when an invalid sort query is passed ', () => {
            return request(app)
                .get(`/api/articles?sort_by=NotAcolumn`)
                .expect(400)
                .then(({ body }) => {

                    expect(body.message).toBe('Invalid sort query');

                });
        });
        test('400: responds with an error when an invalid order is query is passed ', () => {
            return request(app)
                .get(`/api/articles?order=hello`)
                .expect(400)
                .then(({ body }) => {

                    expect(body.message).toBe('Invalid order query');

                });
        });
    });
    describe('api/articles/:article_id/comments', () => {
        test('200: responds with an array of comments of a given article id ', () => {
            const article_id = 5;
            return request(app)
                .get(`/api/articles/${article_id}/comments`)
                .expect(200)
                .then(({ body }) => {
                    const { comments } = body;
                    expect(Array.isArray(comments)).toBe(true);
                    expect(comments.forEach(comment => {
                        expect(comment).toHaveProperty(`comment_id`);
                        expect(comment).toHaveProperty(`votes`);
                        expect(comment).toHaveProperty(`created_at`);
                        expect(comment).toHaveProperty(`author`);
                        expect(comment).toHaveProperty(`body`);
                    }));


                });

        });
        test('404: responds with an error message when passed a route that does not exist ', () => {
            return request(app)
                .get('/api/articles/99999/comments')
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe('Comments not found');
                });
        });
        test('400 : responds with an error message when passed a route that is invalid', () => {
            return request(app)
                .get('/api/articles/NotAnId/comments')
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe('Bad Request');
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
describe('POST', () => {
    describe('api/articles/:article_id/comments', () => {
        test('201: responds with a new comment added to the database', () => {
            const newComment = {
                username: 'lurker',
                body: 'Amamzing article! Loved it!'
            };
            const article_id = 4;
            return request(app)
                .post(`/api/articles/${article_id}/comments`)
                .send(newComment)
                .expect(201)
                .then(({ body }) => {
                    expect(typeof body.comment).toBe('object');
                    expect(body.comment).toEqual(expect.objectContaining({
                        comment_id: 19,
                        body: 'Amamzing article! Loved it!',
                        article_id: 4,
                        author: 'lurker',
                        votes: 0,
                    }));
                });


        });
        test('400: responds with an error message when an empty object body is posted', () => {
            const newComment = {};
            const article_id = 4;
            return request(app)
                .post(`/api/articles/${article_id}/comments`)
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe('Bad Request');
                });
        });
        test('400: responds with an error message when the comment object body is posted without a username', () => {
            const newComment = {
                body: 'Amamzing article! Loved it!'
            };
            const article_id = 4;
            return request(app)
                .post(`/api/articles/${article_id}/comments`)
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe('Bad Request');
                });
        });
        test('400: responds with an error message when the comment object body is posted without a username', () => {
            const newComment = {
                username: 'lurker',
            };
            const article_id = 4;
            return request(app)
                .post(`/api/articles/${article_id}/comments`)
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe('Bad Request');
                });
        });
        test('400: responds with an error message when an  article_id  is invalid ', () => {
            const newComment = {
                username: 'lurker',
                body: 'Amamzing article! Loved it!'
            };
            const article_id = 'notAnID';
            return request(app)
                .post(`/api/articles/${article_id}/comments`)
                .send(newComment)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe('Bad Request');
                });
        });
        test('404: responds with an error message when passed a route that does not exist ', () => {
            const newComment = {
                username: 'lurker',
                body: 'Amamzing article! Loved it!'
            };
            return request(app)
                .post('/api/articles/99999/comments')
                .send(newComment)
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe('Article not found');
                });
        });

    });
});
describe('DELETE', () => {
    describe('/api/comments/:comment_id', () => {
        test('204: should remove the comment with the given comment id', () => {
            const comment_id = 1;
            return request(app)
                .delete(`/api/comments/${comment_id}`)
                .expect(204)
                .then(({ body }) => {
                    expect(body).toEqual({});

                });
        });
        test('404: responds with an error when comment id does not exist ', () => {
            const comment_id = 111111;
            return request(app)
                .delete(`/api/comments/${comment_id}`)
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe('Comment id does not exist');

                });
        });
        test('400: responds with an error when comment id is not valid', () => {
            const comment_id = 'NotAComment';
            return request(app)
                .delete(`/api/comments/${comment_id}`)
                .expect(400)
                .then(({ body }) => {
                    expect(body.message).toBe('Bad Request');

                });
        });
        test('404: responds with an error when the path does not exist ', () => {

            return request(app)
                .delete(`/api/comments/`)
                .expect(404)
                .then(({ body }) => {
                    expect(body.message).toBe('Path Not Found');
                });
        });
    });
});