# Minor League Ballpark Food Tracker

This project contains a simple Node.js server and a basic front-end prototype.

## Running the server

```bash
node server.js
```

The server stores data in the `data/` directory using JSON files. Endpoints include:

- `GET /stadiums` – list stadiums
- `POST /stadiums` – create a stadium
- `GET /meals` – list meals with optional `search` query
- `POST /meals` – create a meal

## Frontend prototype

Open `frontend/index.html` in a browser while the server is running. The page
uses simple React components (loaded from CDN) to list and add stadiums and
meals.

This is a minimal prototype implementing a subset of the design specification.
