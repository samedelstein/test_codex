const { useState, useEffect } = React;

function Nav({ current, setCurrent }) {
  return (
    React.createElement('nav', null,
      ['Stadiums', 'Meals', 'Add Stadium', 'Add Meal'].map(page =>
        React.createElement('a', {
          href: '#',
          key: page,
          onClick: e => { e.preventDefault(); setCurrent(page); },
          style: { backgroundColor: current === page ? '#555' : undefined }
        }, page)
      )
    )
  );
}

function StadiumList() {
  const [stadiums, setStadiums] = useState([]);
  useEffect(() => {
    fetch('/stadiums').then(r => r.json()).then(setStadiums);
  }, []);
  return React.createElement('div', { className: 'container' },
    stadiums.map(s => React.createElement('div', { key: s.id, className: 'list-item' }, `${s.name} - ${s.city}`))
  );
}

function MealList() {
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const url = search ? `/meals?search=${encodeURIComponent(search)}` : '/meals';
    fetch(url).then(r => r.json()).then(setMeals);
  }, [search]);
  return React.createElement('div', { className: 'container' },
    React.createElement('input', {
      type: 'search',
      placeholder: 'Search meals',
      className: 'search-input',
      value: search,
      onChange: e => setSearch(e.target.value)
    }),
    meals.map(m =>
      React.createElement('div', { key: m.id, className: 'list-item' },
        React.createElement('div', null, `${m.food_name} @ ${m.price_usd}`),
        m.rating ? React.createElement('div', null, `Rating: ${m.rating}`) : null,
        m.notes ? React.createElement('div', null, m.notes) : null
      )
    )
  );
}

function AddStadium({ onDone }) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  function submit() {
    fetch('/stadiums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, city })
    }).then(() => onDone('Stadiums'));
  }
  return React.createElement('div', { className: 'container' },
    React.createElement('form', { onSubmit: e => { e.preventDefault(); submit(); } },
      React.createElement('label', null, 'Name'),
      React.createElement('input', { value: name, onChange: e => setName(e.target.value) }),
      React.createElement('label', null, 'City'),
      React.createElement('input', { value: city, onChange: e => setCity(e.target.value) }),
      React.createElement('button', { type: 'submit' }, 'Save')
    )
  );
}

function AddMeal({ onDone }) {
  const [food, setFood] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');
  function submit() {
    fetch('/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        food_name: food,
        price_usd: parseFloat(price),
        rating: parseInt(rating, 10),
        notes
      })
    }).then(() => onDone('Meals'));
  }
  return React.createElement('div', { className: 'container' },
    React.createElement('form', { onSubmit: e => { e.preventDefault(); submit(); } },
      React.createElement('label', null, 'Food'),
      React.createElement('input', { value: food, onChange: e => setFood(e.target.value) }),
      React.createElement('label', null, 'Price'),
      React.createElement('input', { value: price, onChange: e => setPrice(e.target.value) }),
      React.createElement('label', null, 'Rating (1-5)'),
      React.createElement('input', {
        type: 'number',
        min: 1,
        max: 5,
        value: rating,
        onChange: e => setRating(e.target.value)
      }),
      React.createElement('label', null, 'Notes'),
      React.createElement('textarea', { value: notes, onChange: e => setNotes(e.target.value) }),
      React.createElement('button', { type: 'submit' }, 'Save')
    )
  );
}

function App() {
  const [current, setCurrent] = useState('Stadiums');
  let content;
  if (current === 'Stadiums') content = React.createElement(StadiumList, null);
  else if (current === 'Meals') content = React.createElement(MealList, null);
  else if (current === 'Add Stadium') content = React.createElement(AddStadium, { onDone: setCurrent });
  else if (current === 'Add Meal') content = React.createElement(AddMeal, { onDone: setCurrent });
  return React.createElement('div', null,
    React.createElement(Nav, { current, setCurrent }),
    content
  );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
