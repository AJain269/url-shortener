# URL Shortener API

A professional URL shortener backend service built with TypeScript,
Node.js, Express, and MongoDB.

## Features

-   RESTful API with TypeScript\
-   MongoDB integration with Mongoose ODM\
-   Duplicate URL detection -- Same URL gets same short code\
-   Click analytics with tracking\
-   Input validation and error handling\
-   Professional logging with performance metrics\
-   API documentation built‑in

## Tech Stack

**Backend:** Node.js, Express.js, TypeScript\
**Database:** MongoDB with Mongoose\
**Validation:** Built‑in URL validation\
**Logging:** Custom logger with timestamps

## Installation

### Clone the repository

``` bash
git clone https://github.com/AJain269/url-shortener.git
cd url-shortener
```

### Install dependencies

``` bash
npm install
```

### Environment Setup

``` bash
cp .env.example .env
```

Update `.env`:
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/urlshortener

### Run the application

``` bash
npm run dev       # Development mode
npm run build
```

## API Documentation

Visit: `http://localhost:5000`

### Endpoints

  ---------------------------------------------------------------------------------------------
  Method     Endpoint                  Description              Body
  ---------- ------------------------- ------------------------ -------------------------------
  POST       /api/url/shorten          Create short URL         `{ "originalUrl": "string" }`

  GET        /api/url/:shortId         Redirect to original URL \-

  GET        /api/url/:shortId/stats   Get analytics            \-

  GET        /api/url/                 Get all URLs             \-
  ---------------------------------------------------------------------------------------------

## Usage Examples

### Shorten a URL

``` bash
curl -X POST http://localhost:5000/api/url/shorten   -H "Content-Type: application/json"   -d '{"originalUrl": "https://example.com/very-long-url"}'
```

### Redirect

``` bash
curl -L http://localhost:5000/api/url/abc123de
```

### Get Stats

``` bash
curl http://localhost:5000/api/url/abc123de/stats
```

### Get All URLs

``` bash
curl http://localhost:5000/api/url/
```

## Project Structure

    src/
    ├── controllers/
    │   └── url.controller.ts
    ├── models/
    │   └── url.ts
    ├── routes/
    │   └── url.routes.ts
    ├── utils/
    │   └── validation.ts
    ├── index.ts
    ├── .env
    ├── package.json
    └── tsconfig.json

## API Response Format

### Success
``` ts
{
  status: "success",
  shortUrl: string,
  data?: any
}
```

### Error
``` ts
{
  status: "error",
  message: string
}
```

## Status Codes
-   200 -- Success\
-   201 -- Created\
-   302 -- Redirect\
-   400 -- Bad Request\
-   404 -- Not Found\
-   500 -- Server Error

## Features in Detail

### Duplicate URL Detection
-   Same long URL → same short code\
-   Avoids redundant DB entries\
-   Ensures consistent results

### Click Analytics
-   Tracks each redirect\
-   Atomic increments in MongoDB\
-   Usage insights

### Input Validation
-   Native URL validator\
-   Friendly error responses

### Professional Logging
-   Request + response logs\
-   Timings and performance metrics\
-   Stack trace logging

## Development Scripts

``` bash
npm run dev
npm run build
npm start
```

## Environment Variables
-   `PORT=5000`
-   `MONGO_URI=mongodb://localhost:27017/urlshortener`
