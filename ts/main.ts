// DOM Elements
const $apiKey = 'tjsESTV0ZCq5TAudXkKvHgf2h8rRIqIkhHziRF5i';
const $stateSelect = document.querySelector('#states') as HTMLSelectElement;
const $parksContainer = document.querySelector(
  '.parks-container',
) as HTMLElement;
const $overlay = document.querySelector('.overlay') as HTMLElement;
const $parksSection = document.querySelector(
  '[data-view="parks"]',
) as HTMLElement;
const $detailsContainer = document.querySelector(
  '.details-container',
) as HTMLElement;
const $detailsSection = document.querySelector(
  '.details-section',
) as HTMLElement;
const $backButton = document.querySelector('.back-button') as HTMLElement;
const $homeButton = document.querySelector('.home-button') as HTMLElement;
const $faveHomeButton = document.querySelector(
  '.favehome-button',
) as HTMLElement;
const $favoritesButton = document.querySelector(
  '.favorites-button',
) as HTMLElement;
const $favoritesContainer = document.querySelector(
  '.favorites-container',
) as HTMLElement;
const $viewFavoritesButton = document.querySelector(
  '.view-favorites-button',
) as HTMLElement;

// Error handling for DOM
if (!$parksContainer) throw new Error('!$parksContainer does not exist.');
if (!$detailsContainer) throw new Error('!$detailsContainer does not exist.');
if (!$overlay) throw new Error('!$overlay does not exist.');
if (!$parksSection) throw new Error('!$parksSection does not exist.');
if (!$detailsSection) throw new Error('!$detailsSection does not exist.');
if (!$stateSelect) throw new Error('!$stateSelect does not exist.');
if (!$backButton) throw new Error('!$backButton does not exist.');
if (!$homeButton) throw new Error('!$homeButton does not exist.');
if (!$faveHomeButton) throw new Error('!$faveHomeButton does not exist.');
if (!$favoritesButton) throw new Error('!$favoritesButton does not exist.');
if (!$viewFavoritesButton)
  throw new Error('!$viewFavoritesButton does not exist.');

// Fetch parks by state
async function fetchParks(state: string): Promise<void> {
  if (!state) {
    console.error('State is required.');
    return;
  }

  const url = `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=${$apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch parks: ${response.status}`);

    const data = await response.json();
    displayParks(data.data);
    swapView('parks');
  } catch (error) {
    console.error('Error fetching parks:', error);
  }
}

// Display parks in grid view
function displayParks(parks: any[]): void {
  $parksContainer.innerHTML = ''; // Clear previous results

  if (parks.length === 0) {
    $parksContainer.innerHTML = '<p>No parks found.</p>';
    return;
  }

  parks.forEach((park) => createParkCard(park));
}

// To create park card
function createParkCard(park: any): void {
  const parkCard = document.createElement('div');
  parkCard.classList.add('park-card');

  const image = document.createElement('img');
  image.src = park.images?.[0]?.url || 'images/no-image.jpg';
  image.alt = park.fullName;
  image.classList.add('park-image');

  const name = document.createElement('h4');
  name.textContent = park.fullName;
  name.classList.add('park-name');

  const description = document.createElement('p');
  description.textContent = park.description || 'No description available.';
  description.classList.add('park-description');

  const favoriteButton = document.createElement('button');
  favoriteButton.classList.add('favorite-toggle');
  favoriteButton.textContent = isFavorite(park.fullName)
    ? 'Added to Favorites'
    : 'Add to Favorites';

  favoriteButton.addEventListener('click', () => {
    toggleFavorite(park);
    favoriteButton.textContent = isFavorite(park.fullName)
      ? 'Added to Favorites'
      : 'Add to Favorites';
  });

  parkCard.appendChild(image);
  parkCard.appendChild(name);

  parkCard.addEventListener('click', () => showParkDetails(park));

  $parksContainer.appendChild(parkCard);
}

// LocalStorage Favorites Logic
function getFavorites(): any[] {
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function saveFavorites(favorites: any[]): void {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(parkName: string): boolean {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.fullName === parkName);
}

function toggleFavorite(park: any): void {
  const favorites = getFavorites();
  const exists = favorites.some((fav) => fav.fullName === park.fullName);

  if (exists) {
    // Remove if already in favorites
    const updatedFavorites = favorites.filter(
      (fav) => fav.fullName !== park.fullName,
    );
    saveFavorites(updatedFavorites);
  } else {
    // Add to favorites
    favorites.push(park);
    saveFavorites(favorites);
  }
}

// Display all favorites PArks
function displayAllFavorites(): void {
  $parksContainer.innerHTML = ''; // Clear previous results
  const favorites = getFavorites();
  favorites.forEach((park) => createParkCard(park));
}

// Show park details
function showParkDetails(park: any): void {
  if (!$detailsContainer) {
    console.error('Details container is missing.');
    return;
  }

  $detailsContainer.innerHTML = ''; // Clear previous details

  const parkName = document.createElement('h2');
  parkName.textContent = park.fullName;

  const parkImage = document.createElement('img');
  parkImage.src = park.images?.[0]?.url || 'images/no-image.jpg';
  parkImage.alt = park.fullName;
  parkImage.classList.add('park-image-large');

  const parkDescription = document.createElement('p');
  parkDescription.textContent = park.description || 'No description available.';

  const favoriteButton = document.createElement('button');
  favoriteButton.textContent = isFavorite(park.fullName)
    ? 'Added to Favorites'
    : 'Add to Favorites';

  favoriteButton.addEventListener('click', () => {
    toggleFavorite(park);
    favoriteButton.textContent = isFavorite(park.fullName)
      ? 'Added to Favorites'
      : 'Add to Favorites';
  });

  $detailsContainer.appendChild(parkName);
  $detailsContainer.appendChild(parkImage);
  $detailsContainer.appendChild(parkDescription);
  $detailsContainer.appendChild(favoriteButton);

  swapView('details');
}

// View swapping
function swapView(viewName: string): void {
  if (!$overlay) throw new Error('!$overlay does not exist.');
  if (!$parksSection) throw new Error('!$parksSection does not exist.');
  if (!$detailsSection) throw new Error('!$detailsSection does not exist.');
  if (!$parksContainer) throw new Error('!$parksContainer does not exist.');
  if (!$detailsContainer) throw new Error('!$detailsContainer does not exist.');

  $overlay.classList.toggle('hidden', viewName !== 'entry-form');
  $parksContainer.classList.toggle('hidden', viewName !== 'parks');
  $parksSection.classList.toggle('hidden', viewName !== 'parks');
  $detailsSection.classList.toggle('hidden', viewName !== 'details');
  $detailsContainer.classList.toggle('hidden', viewName !== 'details');
  $favoritesContainer.classList.toggle('hidden', viewName !== 'favorites');
  $viewFavoritesButton.classList.toggle('hidden', viewName !== 'favorites');

  if (viewName === 'details') {
    $backButton.classList.remove('hidden'); // Show back button --> 'details view'
    $homeButton.classList.add('hidden'); // Hide home button --> 'details view'
    $detailsContainer.classList.remove('hidden');
    $favoritesButton.classList.remove('hidden'); // Show favorites button --> 'details view'
  } else if (viewName === 'parks') {
    $backButton.classList.add('hidden'); // Hide back button --> 'parks view'
    $homeButton.classList.remove('hidden'); // Show home button --> 'parks view'
    $favoritesButton.classList.add('hidden'); // Hide favorites button --> 'parks view'
  } else if (viewName === 'favorites') {
    $overlay.classList.add('hidden');
    $backButton.classList.remove('hidden'); // Show back button in favorites view
    $homeButton.classList.remove('hidden'); // Show home button in favorites view
    $favoritesContainer.classList.add('hidden'); // Hide favorites button in favorites view
  } else {
    $backButton.classList.add('hidden'); // Hide back button --> 'other views'
    $homeButton.classList.add('hidden'); // Hide back button --> 'other views'
    $favoritesButton.classList.add('hidden'); // Hide favorites button --> 'other views'
  }
}

// Event Listeners
$stateSelect.addEventListener('change', () => {
  const state = $stateSelect.value;

  if (state) {
    fetchParks(state);
    swapView('parks');
  }
});

window.addEventListener('DOMContentLoaded', displayAllFavorites);

$viewFavoritesButton.addEventListener('click', () => {
  swapView('favorites');
});

$favoritesButton.addEventListener('click', () => {
  swapView('favorites');
});

// Back Button Functionality
$backButton.addEventListener('click', () => {
  if ($detailsContainer) {
    $detailsContainer.innerHTML = '';
  }
  swapView('parks');
});

$faveHomeButton.addEventListener('click', () => {
  swapView('entry-form');
});

// Home Button Functionality
$homeButton.addEventListener('click', () => {
  const form = document.querySelector('form') as HTMLFormElement;
  if (form) form.reset();
  swapView('entry-form');
});
