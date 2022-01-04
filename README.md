# Temiloluwa Assessment Submission

This project contains source code and supporting files for the Node.js application that I created. You can check it out on Github here: 
Frontend Repo - https://github.com/tehmi2000/studentserverlessapp

Backend Repo - https://github.com/tehmi2000/studentserverlessapp

This project includes the following files and folders:

- migrations - Sequelize migration files.

- models - Sequelize db models.

- tests - Unit tests for application.

- src/app.js - Exports the express app itself.

- src/utils - Contains helper classes and modules such as sending emails, password hashing, JWT processor, and other utility functions.

- src/api/routes - Route module used by express to serve endpoints.

- src/api/middleware - Contains authentication and validation express middlewares.

- src/api/ApiRepo.js - Contains the controller logic for the route endpoints.

- src/core/data - Contains the database logic code.

- src/core/domain - Contains predefined classes for managing and creating new instances of each sequelize model.

- swagger.json - Contains OpenAPI api documentation.
- server.js - Contains code for launching the express app normally with `node server.js` on the console (cmd, bash...).

## About the application

The application is an express RESTful API that takes HTTP requests and handles the request. The API has POST and GET methods to perform various CRUD operations on Twits, Comments on the Twittee platform. 

**To use the API**

1. Navigate to the **API Documentation Page** (https://twitteeapi.herokuapp.com/api-docs) in your web browser.
1. Read instructions at the top of the page first.
1. Copy the URL that's listed on the **API Documentation Page**.
1. You can copy the Example Code on the webpage into your Javascript code directly. Alternatively, At the command line, use cURL (or Postman) to send GET or POST requests to the application endpoint. For example:

        $ ENDPOINT=https://twitteeapi.herokuapp.com/api/v1/health-check
        $ curl $ENDPOINT


To view a complete list of the application's API endpoint, navigate to the **API Documentation Page** ((https://twitteeapi.herokuapp.com/api-docs))

## Testing

Requirements:

* Node.js - [Install Node.js 14.x](https://nodejs.org/en/), including the npm package management tool.
* XAMPP (or any local MySQL server you can find) - [Install XAMPP](https://www.apachefriends.org/download.html), including the npm package management tool.

Configurations:
* Create a MYSQL database and provide the connection string as defined in the 'env.example' file

* Setup your MySQL tables by running the following command on the command line.

```bash
my-application$ npm run db:migrate
my-application$ npm run test
```

* Start the app by running `npm run dev` to launch in development mode or `npm start` to run in production mode.
