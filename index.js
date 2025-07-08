const drinkContainer = document.getElementById('drinkContainer');
const selectedList = document.getElementById('selectedList');
const drinkCount = document.getElementById('drinkCount');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const modalBg = document.getElementById('modalBg');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');

let allMeals = [];
let filteredMeals = [];
let selectedMeals = [];

const API_ALL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const API_DETAIL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

async function fetchMeals() {
  try {
    const res = await fetch(API_ALL);
    const data = await res.json();
    allMeals = data.meals || [];
    filteredMeals = allMeals.slice(0, 8);
    renderMeals(filteredMeals);
  } catch (error) {
    drinkContainer.innerHTML = `<p class="not-found">Failed to load meals.</p>`;
  }
}

function renderMeals(meals) {
  drinkContainer.innerHTML = '';
  if (meals.length === 0) {
    drinkContainer.innerHTML = `<p class="not-found">No meals found.</p>`;
    return;
  }
  meals.forEach(meal => {
    const card = document.createElement('div');
    card.className = 'drink-card';

    card.innerHTML = `
    <img src=${meal.strMealThumb} alt="img"/>
      <h3>${meal.strMeal}</h3>
      <p><strong>Category:</strong> ${meal.strCategory || 'N/A'}</p>
      <p><strong>Instructions:</strong> ${meal.strInstructions ? meal.strInstructions.slice(0,15) + '...' : 'N/A'}</p>
      <div class="btn-group">
        <button onclick="addToCart('${meal.strMeal}')">Add to Cart</button>
        <button onclick="showDetails('${meal.idMeal}')">Details</button>
      </div>
    `;
    drinkContainer.appendChild(card);
  });
}

function addToCart(mealName) {
  if (selectedMeals.length >= 7) {
    alert('Cannot add more than 7 meals to the group!');
    return;
  }
  if (selectedMeals.includes(mealName)) {
    alert('Meal already added to the group!');
    return;
  }
  selectedMeals.push(mealName);
  renderSelected();
}

function renderSelected() {
  selectedList.innerHTML = '';
  selectedMeals.forEach(meal => {
    const li = document.createElement('li');
    li.textContent = meal;
    selectedList.appendChild(li);
  });
  drinkCount.textContent = selectedMeals.length;
}

function searchMeals() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    filteredMeals = allMeals.slice(0, 8);
  } else {
    filteredMeals = allMeals.filter(meal =>
      meal.strMeal.toLowerCase().includes(query)
    );
  }
  renderMeals(filteredMeals);
}

async function showDetails(mealId) {
  try {
    const res = await fetch(API_DETAIL + mealId);
    const data = await res.json();
    const meal = data.meals[0];
    modalTitle.textContent = meal.strMeal;
    modalContent.innerHTML = `
       <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />

  <h3>${meal.strMeal}</h3>
  <p><strong>Category:</strong> ${meal.strCategory || 'N/A'}</p>
  <p><strong>Instructions:</strong> ${meal.strInstructions ? meal.strInstructions.slice(0,15) + '...' : 'N/A'}</p>
  <div class="btn-group">
    <button onclick="addToGroup('${meal.strMeal}')">Add to Group</button>
    <button onclick="showDetails('${meal.idMeal}')">Details</button>
  </div>
    `;
    modalBg.style.display = 'flex';
  } catch (error) {
    alert('Failed to load meal details.');
  }
}

modalClose.addEventListener('click', () => {
  modalBg.style.display = 'none';
});

searchBtn.addEventListener('click', () => {
  searchMeals();
});

searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchMeals();
});

fetchMeals();
