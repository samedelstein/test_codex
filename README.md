# Minor League Ballpark Food Tracker

This project contains a simple Node.js server that provides basic REST endpoints for stadiums and meals.

## Running

```bash
node server.js
```

The server stores data in the `data/` directory using JSON files. Endpoints include:

- `GET /stadiums` – list stadiums
- `POST /stadiums` – create a stadium
- `GET /meals` – list meals with optional `search` query
- `POST /meals` – create a meal

This is a minimal prototype implementing a subset of the design specification.
