const $apiKey = 'tjsESTV0ZCq5TAudXkKvHgf2h8rRIqIkhHziRF5i';
const $stateSelect = document.querySelector('#states') as HTMLSelectElement;
const $parksContainer = document.querySelector('.parks-container');
const $overlay = document.querySelector('.overlay') as HTMLElement;
const $parksSection = document.querySelector(
  '[data-view="parks"]',
) as HTMLElement; // Added reference to the parks section

if (!$apiKey) throw new Error('!$apiKey is missing');
if (!$stateSelect) throw new Error('!$stateSelect dropdown does not exist.');

if (!$overlay) throw new Error('!$overlay does not exist.');

function getParkUrl(state: string): string {
  return `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=${$apiKey}`;
}

async function fetchParks(state: string): Promise<void> {
  if (!state) throw new Error('State is required.');

  const url = getParkUrl(state);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const info = await response.json();
    displayParks(info);
    console.log(info);

    swapView('entry-form');
  } catch (error) {
    console.error('Error fetching parks:', error);
  }
}

function displayParks(data: any): void {
  if (!$parksContainer) throw new Error('!$parksContainer does not exist.');

  $parksContainer.innerHTML = ''; // Clear previous results

  data.data.forEach((park: any) => {
    if (park.images.length > 0) {
      const parkCard = document.createElement('div');
      parkCard.classList.add('park-card');

      const imageContainer = document.createElement('div');
      imageContainer.style.height = '150px';

      const image = document.createElement('img');
      image.src = park.images[0].url;
      image.alt = park.fullName;
      image.classList.add('park-image');

      imageContainer.appendChild(image);

      const name = document.createElement('h4');
      name.textContent = park.fullName;
      name.classList.add('park-name');

      parkCard.appendChild(imageContainer);
      parkCard.appendChild(name);
      $parksContainer.appendChild(parkCard);
    }
  });
  $parksSection.appendChild($parksContainer);
}

// hides the Your destination container
function swapView(viewName: 'entries' | 'entry-form'): void {
  if (!$parksContainer) throw new Error('!$parksContainer does not exist.');

  $overlay.classList.toggle('hidden', viewName !== 'entries');
  $parksContainer.classList.toggle('hidden', viewName !== 'entry-form');
}

// Event listener for dropdown changes
$stateSelect.addEventListener('change', () => {
  fetchParks($stateSelect.value);
});
