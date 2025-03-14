const $apiKey = 'tjsESTV0ZCq5TAudXkKvHgf2h8rRIqIkhHziRF5i';
const $stateSelect = document.querySelector('#states') as HTMLSelectElement;
const $parksContainer = document.createElement('div');
document.body.appendChild($parksContainer);

if (!$apiKey) throw new Error('!$apiKey is missing');
if (!$stateSelect) throw new Error('!$stateSelect dropdown does not exist.');
if (!$parksContainer) throw new Error('!$parksContainer does not exist.');

function getParkUrl(state: string): string {
  return `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=${$apiKey}`;
}

async function fetchParks(state: string): Promise<void> {
  if (!state) throw new Error('!state dropdown does not exist.');

  const url = getParkUrl(state);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const info = await response.json();
    console.log(info);
    displayParks(info);
  } catch (error) {
    console.error('Error fetching parks:', error);
  }
}

function displayParks(data: any): void {
  $parksContainer.innerHTML = ''; // Clear previous results

  data.data.forEach((park: any) => {
    if (park.images.length > 0) {
      const parkCard = document.createElement('div');
      parkCard.classList.add('park-card');

      const image = document.createElement('img');
      image.src = park.images[0].url;
      image.alt = park.fullName;
      image.classList.add('park-image');

      const name = document.createElement('h4');
      name.textContent = park.fullName;
      name.classList.add('park-name');

      parkCard.appendChild(image);
      parkCard.appendChild(name);
      $parksContainer.appendChild(parkCard);
    }
  });
}

// Event listener for dropdown changes
$stateSelect.addEventListener('change', function () {
  fetchParks($stateSelect.value);
});
