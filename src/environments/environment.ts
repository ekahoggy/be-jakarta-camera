let apiURL = 'https://apijakartacamera.moodstudio.id/api/v1';
let imgURL = 'https://apijakartacamera.moodstudio.id/storage/images/';

if (window.location.hostname == 'localhost') {
  apiURL = 'http://127.0.0.1:8000/api/v1';
  imgURL = 'http://127.0.0.1:8000/storage/images/';
}

export const environment = {
  apiURL: apiURL,
  imgURL: imgURL,
  tinyMCE : '5gu15warc1ppkm0rq253hrims1chc9kxgl1urh0f5ctpivkx',

  version: 1.0
};
