# Northcoders News API
NC NEWS API server is built to access application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Instructions to follow after cloning this repo:

1. You'll need two .env files such as .env.test and .env.development because we have two databases to link in connection.js file. These databases are different for developement and test purposes.

2. In .env.test you should write PGDATABASE=nc_news_test .

3. You should write PGDATABASE=nc_news in .env.development file.
