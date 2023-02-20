//voilà le code qui se lance lorsque l'extension est ouverte -> voir background.js pour plus d'informations sur le fonctionnement du programme.
const userId = 31289086;
const clientId = 'f6b1ab61algshxa8okspaizwh92p1n';
const token = '95l2c9soqtx84062bfeolxon2pts8h';

const url = `https://api.twitch.tv/helix/streams?user_id=${userId}`;
const headers = {
  'Authorization' : `Bearer ${token}`,
  'Client-ID': clientId
}

const info = document.getElementById('info');

const callback = function (json) {
  info.innerHTML = json.data.length ? "Wankil est en live !" : "Wankil n'est pas en live :(";
}

function fetchTwitchAPI(url, headers, callback){
  fetch(url, {
    headers: headers
  }).then((response) => {
      return response.json();
  }).then((json) => callback(json));
}

fetchTwitchAPI(url, headers, callback);
