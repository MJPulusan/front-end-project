"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const $stateSelect = document.querySelector('#states');
    if (!$stateSelect)
        throw new Error('!$stateSelect does not exist.');
    // try {
    // const response = await fetch(`https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=tjsESTV0ZCq5TAudXkKvHgf2h8rRIqIkhHziRF5i`);
    // const data = await response.json();
    // } catch (error) {
    //   console.log('Error:', error);
    // }
});
async function fetchParks(sc) {
    const api = 'tjsESTV0ZCq5TAudXkKvHgf2h8rRIqIkhHziRF5i';
    const urlink = `https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=${api}`;
}
