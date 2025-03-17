const $apiKey = 'tjsESTV0ZCq5TAudXkKvHgf2h8rRIqIkhHziRF5i';
const $stateSelect = document.querySelector('#states') as HTMLSelectElement;
const $parksContainer = document.querySelector('.parks-container');
const $overlay = document.querySelector('.overlay') as HTMLElement;
const $parksSection = document.querySelector(
  '[data-view="parks"]',
) as HTMLElement;
const $detailsContainer = document.querySelector('.details-container');
const $detailsSection = document.querySelector('.details-section');
const $backButton = document.querySelector('.back-button') as HTMLElement;
const $homeButton = document.querySelector('.home-button') as HTMLElement;
const $overlay2 = document.querySelector('#overlay2') as HTMLElement;

// Error Checks
if (!$apiKey) throw new Error('!$apiKey is missing');
if (!$stateSelect) throw new Error('!$stateSelect dropdown does not exist.');
if (!$parksContainer) throw new Error('!$parksContainer does not exist.');
if (!$backButton) throw new Error('!$backButton does not exist.');
if (!$homeButton) throw new Error('!$homeButton does not exist.');
if (!$overlay2) throw new Error('!$overlay2 does not exist.');

function getParkUrl(state: string): string {
  return `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=${$apiKey}`;
}

// to fetch Parks Data from API
async function fetchParks(state: string): Promise<void> {
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

// Display Parks Data
function displayParks(parks: any[]): void {
  if (!$parksContainer) throw new Error('!$parksContainer does not exist.');

  $parksContainer.innerHTML = ''; // Clear 'previous results'

  parks.forEach((park: any) => {
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

      // Click event --> full details
      parkCard.addEventListener('click', () => showParkDetails(park));

      parkCard.appendChild(image);
      parkCard.appendChild(name);
      $parksContainer.appendChild(parkCard);
    }
  });
}

// To show Full Park Details
function showParkDetails(park: any): void {
  if (!$detailsContainer) throw new Error('!$detailsContainer does not exist.');

  $detailsContainer.innerHTML = ''; // Clear 'previous details'

  const parkName = document.createElement('h2');
  parkName.textContent = park.fullName;

  const parkImage = document.createElement('img');
  if (park.images.length > 0) {
    parkImage.src = park.images[1].url;
  } else {
    parkImage.src = 'images/no-image.jpg';
  }

  parkImage.alt = park.fullName;
  parkImage.classList.add('park-image-large');

  const parkDescription = document.createElement('p');
  parkDescription.textContent = park.description;

  $detailsContainer.appendChild(parkName);
  $detailsContainer.appendChild(parkImage);
  $detailsContainer.appendChild(parkDescription);

  swapView('details');
}

// Viewswapping between views
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

  if (viewName === 'details') {
    $backButton.classList.remove('hidden'); // Show back button --> 'details view'
    $homeButton.classList.add('hidden'); // Hide home button --> 'details view'
    $detailsContainer.classList.remove('hidden');
  } else if (viewName === 'parks') {
    $backButton.classList.add('hidden'); // Hide back button --> 'parks view'
    $homeButton.classList.remove('hidden'); // Show home button --> 'parks view'
  } else {
    $backButton.classList.add('hidden'); // Hide back button --> 'other views'
    $homeButton.classList.add('hidden'); // Hide back button --> 'other views'
  }
}

// Event Listeners
$stateSelect.addEventListener('change', () => {
  fetchParks($stateSelect.value);
});

// Back button event
$backButton.addEventListener('click', () => {
  if ($detailsContainer) {
    $detailsContainer.innerHTML = '';
  }
  swapView('parks');
});

// Home button event
$homeButton.addEventListener('click', () => {
  const form = document.querySelector('form') as HTMLFormElement;

  if (form) {
    form.reset(); // Resets dropdown --> default option
  }
  swapView('entry-form');
});
