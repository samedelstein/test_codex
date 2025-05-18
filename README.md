# Minor League Ballpark Food Tracker



```bash
node server.js
```

The server stores data in the `data/` directory using JSON files. Endpoints include:

- `GET /stadiums` – list stadiums
- `POST /stadiums` – create a stadium
- `GET /meals` – list meals with optional `search` query
- `POST /meals` – create a meal
