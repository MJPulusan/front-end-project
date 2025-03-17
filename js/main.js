'use strict';
const $apiKey = 'tjsESTV0ZCq5TAudXkKvHgf2h8rRIqIkhHziRF5i';
const $stateSelect = document.querySelector('#states');
const $parksContainer = document.querySelector('.parks-container');
const $overlay = document.querySelector('.overlay');
const $parksSection = document.querySelector('[data-view="parks"]');
const $detailsContainer = document.querySelector('.details-container');
const $detailsSection = document.querySelector('.details-section');
const $backButton = document.querySelector('.back-button');
if (!$apiKey) throw new Error('!$apiKey is missing');
if (!$stateSelect) throw new Error('!$stateSelect dropdown does not exist.');
if (!$parksContainer) throw new Error('!$parksContainer does not exist.');
function getParkUrl(state) {
  return `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=${$apiKey}`;
}
async function fetchParks(state) {
  if (!state) throw new Error('State is required.');
  const url = getParkUrl(state);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    displayParks(data.data);
    swapView('parks');
  } catch (error) {
    console.error('Error fetching parks:', error);
  }
}
function displayParks(parks) {
  if (!$parksContainer) throw new Error('!$parksContainer does not exist.');
  $parksContainer.innerHTML = ''; // Clear previous results
  parks.forEach((park) => {
    if (park.images.length > 0) {
      const parkCard = document.createElement('div');
      parkCard.classList.add('park-card');
      // Image
      const image = document.createElement('img');
      image.src = park.images[0].url;
      image.alt = park.fullName;
      image.classList.add('park-image');
      // Park Name
      const name = document.createElement('h4');
      name.textContent = park.fullName;
      name.classList.add('park-name');
      // Click event to show full details
      parkCard.addEventListener('click', () => showParkDetails(park));
      parkCard.appendChild(image);
      parkCard.appendChild(name);
      $parksContainer.appendChild(parkCard);
    }
  });
}
// Function to show full park details
function showParkDetails(park) {
  if (!$detailsContainer) throw new Error('!$detailsContainer does not exist.');
  $detailsContainer.innerHTML = ''; // Clear previous details
  const parkName = document.createElement('h2');
  parkName.textContent = park.fullName;
  const parkImage = document.createElement('img');
  parkImage.src =
    park.images.length > 0 ? park.images[0].url : 'images/no-image.jpg';
  parkImage.alt = park.fullName;
  parkImage.classList.add('park-image-large');
  const parkDescription = document.createElement('p');
  parkDescription.textContent = park.description;
  if (!$detailsContainer) throw new Error('!$detailsContainer does not exist.');
  $detailsContainer.appendChild(parkName);
  $detailsContainer.appendChild(parkImage);
  $detailsContainer.appendChild(parkDescription);
  swapView('details');
}
// Hide or show sections
function swapView(viewName) {
  if (!$overlay) throw new Error('!$overlay does not exist.');
  if (!$parksSection) throw new Error('!$parksSection does not exist.');
  if (!$detailsSection) throw new Error('!$detailsSection does not exist.');
  if (!$parksContainer) throw new Error('!$parksContainer does not exist.');
  $overlay.classList.toggle('hidden', viewName !== 'entry-form');
  $parksContainer.classList.toggle('hidden', viewName !== 'parks');
  $parksSection.classList.toggle('hidden', viewName !== 'parks');
  $detailsSection.classList.toggle('hidden', viewName !== 'details');
}
// Event listener for dropdown changes
$stateSelect.addEventListener('change', () => {
  fetchParks($stateSelect.value);
});
if (!$backButton) throw new Error('!$backButton does not exist.');
// Event listener for back button
$backButton.addEventListener('click', () => {
  if ($detailsContainer) {
    $detailsContainer.innerHTML = '';
  }
  swapView('parks');
});
