let apiURL = 'https://api.jakartacamera.com/api/v1';
let imgURL = 'https://api.jakartacamera.com/storage/images/';

if (window.location.hostname == 'localhost') {
  apiURL = 'http://127.0.0.1:8000/api/v1';
  imgURL = 'http://127.0.0.1:8000/storage/images/';
}

export const environment = {
  apiURL: apiURL,
  imgURL: imgURL,
  tinyMCE : '9bd5bwpmnlplbo33i8wo7nezk7e8qdthlb5abd23hgr7smro',
  version: 1.0
};
