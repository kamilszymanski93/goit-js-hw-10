// const KEY =
//   'live_idIZYnecHH32vszveU4i2ziq4wdKrE7fa9zUSVuW6nPGuGlzHOwUNGhn4t1Su8ey';
const catBreeds =
  'https://api.thecatapi.com/v1/breeds?api_key=live_idIZYnecHH32vszveU4i2ziq4wdKrE7fa9zUSVuW6nPGuGlzHOwUNGhn4t1Su8ey';
catFilter = document.querySelector('.breed-select');
const chosenCatInfo = 'https://api.thecatapi.com/v1/images/search';
let loadingInfo;
let errorInfo;
loadingInfo = document.querySelector('.loader');
errorInfo = document.querySelector('.error');
const catCard = document.querySelector('.cat-info');
function hideAlert(alertVisible) {
  alertVisible.classList.add('hidden');
}
hideAlert(loadingInfo);

function showAlert(alertVisible) {
  alertVisible.classList.remove('hidden');
}
showAlert(errorInfo);
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
      const pictureLink = `<div><img src="${data[0].url}" class="cat-pic"></div>`;
      catCard.insertAdjacentHTML('afterbegin', pictureLink);
    })
    .catch(err => {
      showAlert(errorInfo);
    });
  const catInfo = `https://api.thecatapi.com/v1/breeds/${breedId}`;
  pingUrl(catInfo)
    .then(data => {
      const catDesciption = `<div class="cat-txt"><h1>${data.name}</h1><p>${data.description}</p><h2>Temperament</h2><p>${data.temperament}</p></div>`;
      catCard.insertAdjacentHTML('beforeend', catDesciption);
    })
    .catch(err => {
      showAlert(errorInfo);
    });
}

function handleFilterForm(e) {
  showAlert(loadingInfo);
  catCard.innerHTML = '';
  fetchCatByBreed(e.target.value);
  setTimeout(function () {
    hideAlert(loadingInfo);
  }, 500);
}

catFilter.addEventListener('change', handleFilterForm);
