const drinkContainer = document.getElementById('drinkContainer');
const selectedList = document.getElementById('selectedList');
const drinkCount = document.getElementById('drinkCount');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const modalBg = document.getElementById('modalBg');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');

let allDrinks = [];
let filteredDrinks = [];
let selectedDrinks = [];

const API_ALL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a';
const API_DETAIL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';

async function fetchDrinks() {
  try {
    const res = await fetch(API_ALL);
    const data = await res.json();
    allDrinks = data.drinks || [];
    filteredDrinks = allDrinks.slice(0, 8);
    renderDrinks(filteredDrinks);
  } catch (error) {
    drinkContainer.innerHTML = `<p class="not-found">Failed to load drinks.</p>`;
  }
}

function renderDrinks(drinks) {
  drinkContainer.innerHTML = '';
  if (drinks.length === 0) {
    drinkContainer.innerHTML = `<p class="not-found">No drinks found.</p>`;
    return;
  }
  drinks.forEach(drink => {
    const card = document.createElement('div');
    card.className = 'drink-card';

    card.innerHTML = `
      <img src=${drink.strDrinkThumb} alt="img"/>
      <h3>${drink.strDrink}</h3>
      <p><strong>Category:</strong> ${drink.strCategory || 'N/A'}</p>
      <p><strong>Instructions:</strong> ${drink.strInstructions ? drink.strInstructions.slice(0, 15) + '...' : 'N/A'}</p>
      <div class="btn-group">
        <button onclick="addToCart('${drink.strDrink}')">Add to Cart</button>
        <button onclick="showDetails('${drink.idDrink}')">Details</button>
      </div>
    `;
    drinkContainer.appendChild(card);
  });
}

function addToCart(drinkName) {
  if (selectedDrinks.length >= 7) {
    alert('Cannot add more than 7 drinks to the group!');
    return;
  }
  if (selectedDrinks.includes(drinkName)) {
    alert('Drink already added to the group!');
    return;
  }
  selectedDrinks.push(drinkName);
  renderSelected();
}

function renderSelected() {
  selectedList.innerHTML = '';
  selectedDrinks.forEach(drink => {
    const li = document.createElement('li');
    li.textContent = drink;
    selectedList.appendChild(li);
  });
  drinkCount.textContent = selectedDrinks.length;
}

function searchDrinks() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    filteredDrinks = allDrinks.slice(0, 8);
  } else {
    filteredDrinks = allDrinks.filter(drink =>
      drink.strDrink.toLowerCase().includes(query)
    );
  }
  renderDrinks(filteredDrinks);
}

async function showDetails(drinkId) {
  try {
    const res = await fetch(API_DETAIL + drinkId);
    const data = await res.json();
    const drink = data.drinks[0];
    modalTitle.textContent = drink.strDrink;
    modalContent.innerHTML = `
      <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
      <h3>${drink.strDrink}</h3>
      <p><strong>Category:</strong> ${drink.strCategory || 'N/A'}</p>
      <p><strong>Instructions:</strong> ${drink.strInstructions ? drink.strInstructions.slice(0, 15) + '...' : 'N/A'}</p>
      <div class="btn-group">
        <button onclick="addToCart('${drink.strDrink}')">Add to Group</button>
        <button onclick="showDetails('${drink.idDrink}')">Details</button>
      </div>
    `;
    modalBg.style.display = 'flex';
  } catch (error) {
    alert('Failed to load drink details.');
  }
}

modalClose.addEventListener('click', () => {
  modalBg.style.display = 'none';
});

searchBtn.addEventListener('click', () => {
  searchDrinks();
});

searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchDrinks();
});

fetchDrinks();
