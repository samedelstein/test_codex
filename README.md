# Minor League Ballpark Food Tracker



```bash
npm start
```

The server stores data in the `data/` directory using JSON files. The server also serves the frontend from `/frontend`, so visiting `http://localhost:3000` loads the React app.
Endpoints include:

- `GET /stadiums` – list stadiums
- `POST /stadiums` – create a stadium
- `GET /meals` – list meals with optional `search` query
- `POST /meals` – create a meal
