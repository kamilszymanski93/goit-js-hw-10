const catBreeds =
  'https://api.thecatapi.com/v1/breeds?api_key=live_Fz088v06Oa2T3XenHKHYugySNsNfigXS6fNayyqL7kr3aLZlb8CDJIPNgxqHR5AO';

const catFilter = document.querySelector('.breed-select');
const chosenCatInfo = 'https://api.thecatapi.com/v1/images/search';
let loading;
let errorInfo;
loading = document.querySelector('.loader');
errorInfo = document.querySelector('.error');
const catCard = document.querySelector('.cat-info');
function hideAlert(loader) {
  loader.classList.add('hidden');
}
hideAlert(loading);
hideAlert(errorInfo);
function showAlert(loader) {
  loader.classList.remove('hidden');
}
function pingUrl(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          reject(errorInfo);
        } else {
          return response.json();
        }
      })
      .then(data => {
        resolve(data);
      })
      .catch(err => reject(err));
  });
}

function fetchBreeds() {
  pingUrl(catBreeds).then(data => {
    const catChoices = data
      .map(dataOne => `<option value='${dataOne.id}'>${dataOne.name}</option>`)
      .join('');
    catFilter.insertAdjacentHTML('afterbegin', catChoices);
  });
}
fetchBreeds();

function fetchCatByBreed(breedId) {
  const catUrl = `${chosenCatInfo}?breed_ids=${breedId}`;
  pingUrl(catUrl)
    .then(data => {
      const pictureLink = `<div><img src="${data[0].url}" class= "cat-pic"></div>`;
      catCard.insertAdjacentHTML('afterbegin', pictureLink);
    })
    .catch(err => {
      showAlert(errorInfo);
    });
  const catInfo = `https://api.thecatapi.com/v1/breeds/${breedId}`;
  pingUrl(catInfo)
    .then(data => {
      const catDesciption = `<div class = "cat-txt"><h1>${data.name}</h1><p>${data.description}</p><h2>Temperament</h2><p>${data.temperament}</p></div>`;
      catCard.insertAdjacentHTML('beforeend', catDesciption);
    })
    .catch(err => {
      showAlert(errorInfo);
    });
}

function handleFilterForm(e) {
  hideAlert(errorInfo);
  showAlert(loading);
  catCard.innerHTML = '';
  fetchCatByBreed(e.target.value);
  setTimeout(function () {
    hideAlert(loading);
  }, 500);
}

catFilter.addEventListener('change', handleFilterForm);
