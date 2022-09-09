\c nc_news_test

SELECT * FROM articles

LEFT JOIN articles ON articles.article_id = comments.article_id