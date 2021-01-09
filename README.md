# NestJS REST API

## Description

This is a NestJS API using MongoDB and Redis to build a Blog with CRUD endpoints for Categories and Posts.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing the app

Unit tests:

```bash
npm run test
```

## Open API (Swagger)

OpenAPI specification is a language-agnostic definition format used to describe RESTful APIs.

When running the project locally, visit http://localhost:3000/swagger to access the Swagger UI.

## Using MongoDB locally with Docker

Download the latest MongoDB image.

```
docker pull mongo:latest
```

Run the container in detached mode, or in the background. Map the container ports with host ports so that the database can be accessed from a local host-level application. The port used is from the MongoDB documentation.

```
docker run -d -p 27017:27017 mongo
```

List docker containers to see if the mongo container is running.

```
docker container ls
```

## Using Redis locally with Docker

Run the container in detached mode, or in the background. Map the container ports with host ports so that redis can be accessed from a local host-level application.

```
docker run -d -p 6379:6379 redis
```

List docker containers to see if the redis container is running.

```
docker container ls
```

## Using redis-cli to test Redis

Start *redis-cli* using the following command. 

```
npm run rediscli
```

The `rediscli` script is configured to use the default host and port `127.0.0.1:6379` of a local machine in `package.json`.

We can query redis to see if one of our project's cache keys exist. We can use `exists categories` or `exists posts`. A response of `(integer) 1` means the keys exist. To view the data stored for a cache key, use `get categories` or `get posts`.

## Stay in touch

- Twitter - [@stevenspads](https://twitter.com/stevenspads)
