const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const STADIUMS_FILE = path.join(DATA_DIR, 'stadiums.json');
const MEALS_FILE = path.join(DATA_DIR, 'meals.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(STADIUMS_FILE)) fs.writeFileSync(STADIUMS_FILE, '[]');
  if (!fs.existsSync(MEALS_FILE)) fs.writeFileSync(MEALS_FILE, '[]');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function handleJson(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {};
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}

function listStadiums(res) {
  const stadiums = readJson(STADIUMS_FILE);
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(stadiums));
}

function createStadium(req, res) {
  handleJson(req, (err, data) => {
    if (err) {
      res.writeHead(400);
      return res.end('Invalid JSON');
    }
    const stadiums = readJson(STADIUMS_FILE);
    data.id = Date.now().toString();
    stadiums.push(data);
    writeJson(STADIUMS_FILE, stadiums);
    res.writeHead(201, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
  });
}

function listMeals(req, res) {
  const meals = readJson(MEALS_FILE);
  const url = new URL(req.url, `http://${req.headers.host}`);
  const search = url.searchParams.get('search');
  let results = meals;
  if (search) {
    const s = search.toLowerCase();
    results = meals.filter(m =>
      (m.food_name && m.food_name.toLowerCase().includes(s)) ||
      (m.notes && m.notes.toLowerCase().includes(s))
    );
  }
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(results));
}

function createMeal(req, res) {
  handleJson(req, (err, data) => {
    if (err) {
      res.writeHead(400);
      return res.end('Invalid JSON');
    }
    const meals = readJson(MEALS_FILE);
    data.id = Date.now().toString();
    meals.push(data);
    writeJson(MEALS_FILE, meals);
    res.writeHead(201, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
  });
}

function router(req, res) {
  if (req.method === 'GET' && req.url.startsWith('/stadiums')) {
    return listStadiums(res);
  }
  if (req.method === 'POST' && req.url.startsWith('/stadiums')) {
    return createStadium(req, res);
  }
  if (req.method === 'GET' && req.url.startsWith('/meals')) {
    return listMeals(req, res);
  }
  if (req.method === 'POST' && req.url.startsWith('/meals')) {
    return createMeal(req, res);
  }
  res.writeHead(404);
  res.end('Not Found');
}

ensureDataFiles();
const server = http.createServer(router);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
