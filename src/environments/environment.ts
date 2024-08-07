let apiURL = 'https://api.jakartacamera.com/api/v1';
let imgURL = 'https://api.jakartacamera.com/storage/images/';

if (window.location.hostname == 'localhost') {
  apiURL = 'http://127.0.0.1:8000/api/v1';
  imgURL = 'http://127.0.0.1:8000/storage/images/';
}

export const environment = {
  apiURL: apiURL,
  imgURL: imgURL,
  tinyMCE : '8eqbsrrhxgoxylb5f82gvozwaf6ojs9d3nwi1jgl3d502qw2',

  version: 1.0
};
