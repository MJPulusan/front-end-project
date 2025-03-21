// DOM Elements
const $apiKey = 'tjsESTV0ZCq5TAudXkKvHgf2h8rRIqIkhHziRF5i';
const $stateSelect = document.querySelector('#states') as HTMLSelectElement;
const $parksContainer = document.querySelector(
  '.parks-container',
) as HTMLElement;
const $overlay = document.querySelector('.overlay') as HTMLElement;
const $detailsContainer = document.querySelector(
  '.details-container',
) as HTMLElement;
const $homeButtons =
  document.querySelectorAll<HTMLButtonElement>('.home-button');
const $favoritesContainer = document.querySelector(
  '.favorites-container',
) as HTMLElement;
const $viewFavoritesButton = document.querySelector(
  '.view-favorites-button',
) as HTMLElement;

const $entryForm = document.querySelector('[data-view="entry-form"]');
const $searchResults = document.querySelector('[data-view="search-results"]');
const $favoritesView = document.querySelector('[data-view="favorites"]');

// Error handling for DOM
if (!$parksContainer) throw new Error('!$parksContainer does not exist.');
if (!$overlay) throw new Error('!$overlay does not exist.');
if (!$stateSelect) throw new Error('!$stateSelect does not exist.');
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
    swapView('search-results');
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

  parks.forEach((park) => $parksContainer.appendChild(createParkCard(park)));
}

// To create park card
function createParkCard(park: any): HTMLDivElement {
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
    ? 'Remove from Favorites'
    : 'Add to Favorites';

  favoriteButton.addEventListener('click', () => {
    toggleFavorite(park);
    favoriteButton.textContent = isFavorite(park.fullName)
      ? 'Remove from Favorites'
      : 'Add to Favorites';
  });

  parkCard.appendChild(image);
  parkCard.appendChild(name);

  parkCard.addEventListener('click', () => showParkDetails(park));

  return parkCard;
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
  $favoritesContainer.innerHTML = ''; // Clear previous results
  const favorites = getFavorites();

  if (favorites.length === 0) {
    // Display empty message when no favorites
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No favorites added yet.';
    emptyMessage.classList.add('empty-message');
    $favoritesContainer.appendChild(emptyMessage);
    return;
  }
  favorites.forEach((park) =>
    $favoritesContainer.appendChild(createParkCard(park)),
  );
}

// Show park details
function showParkDetails(park: any): void {
  $detailsContainer.innerHTML = ''; // Clear previous details

  const parkName = document.createElement('h2');
  parkName.textContent = park.fullName;
  const parkImage = document.createElement('img');
  parkImage.src = park.images?.[0]?.url || 'images/no-image.jpg';
  parkImage.alt = park.fullName;
  parkImage.classList.add('park-image-large');

  const parkDescription = document.createElement('p');
  parkDescription.textContent = park.description || 'No description available.';

  const $buttonsContainer = document.createElement('div');
  $buttonsContainer.classList.add('details-button-container');

  const favoriteButton = document.createElement('button');
  favoriteButton.textContent = isFavorite(park.fullName)
    ? 'Remove from Favorites'
    : 'Add to Favorites';

  favoriteButton.addEventListener('click', () => {
    toggleFavorite(park);
    favoriteButton.textContent = isFavorite(park.fullName)
      ? 'Remove from Favorites'
      : 'Add to Favorites';
  });

  const $backButton = document.createElement('button');
  $backButton.textContent = 'Return to results';
  $backButton.addEventListener('click', () => swapView('search-results'));

  $detailsContainer.appendChild(parkName);
  $detailsContainer.appendChild(parkImage);
  $detailsContainer.appendChild(parkDescription);
  $buttonsContainer.append($backButton, favoriteButton);
  $detailsContainer.appendChild($buttonsContainer);

  swapView('individual-park');
}

// View swapping
function swapView(viewName: string): void {
  if (viewName === 'entry-form') {
    $entryForm?.classList.remove('hidden');
    $searchResults?.classList.add('hidden');
    $favoritesView?.classList.add('hidden');
    $detailsContainer.classList.add('hidden');
  } else if (viewName === 'search-results') {
    $searchResults?.classList.remove('hidden');
    $entryForm?.classList.add('hidden');
    $favoritesView?.classList.add('hidden');
    $detailsContainer.classList.add('hidden');
  } else if (viewName === 'individual-park') {
    $detailsContainer.classList.remove('hidden');
    $searchResults?.classList.add('hidden');
    $entryForm?.classList.add('hidden');
    $favoritesView?.classList.add('hidden');
  } else if (viewName === 'favorites') {
    $favoritesView?.classList.remove('hidden');
    $entryForm?.classList.add('hidden');
    $searchResults?.classList.add('hidden');
    $detailsContainer.classList.add('hidden');
  }
}

// Event Listeners
$stateSelect.addEventListener('change', () => {
  const state = $stateSelect.value;

  if (state) {
    fetchParks(state);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  swapView('entry-form');
});

$viewFavoritesButton.addEventListener('click', () => {
  displayAllFavorites();
  swapView('favorites');
});

// Home Button Functionality
$homeButtons.forEach((button: HTMLButtonElement) =>
  button.addEventListener('click', () => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) form.reset();
    swapView('entry-form');
  }),
);
