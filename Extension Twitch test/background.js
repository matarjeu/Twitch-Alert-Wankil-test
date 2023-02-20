//Voilà le programme qui tourne en arrière-plan pour notifier du début de live - n'a pas de lien avec le popup qui apparaît lorsque l'extension est ouverte

const userId = 31289086; //à déterminer sur Postman (GET Streams) avec le clientId et l'Authorization
const clientId = 'f6b1ab61algshxa8okspaizwh92p1n'; //à déterminer sur Postman (GET Users)
const token = '95l2c9soqtx84062bfeolxon2pts8h';//donné par Twitch ici
const twitchUrl = 'https://www.twitch.tv/wankilstudio' //url de la chaîne Twitch que l'on souhaite

const url = `https://api.twitch.tv/helix/streams?user_id=${userId}`;//url servant à envoyer une requête à Twitch
const headers = {
  'Authorization' : `Bearer ${token}`,
  'Client-ID': clientId
}

let isLiveOn = false; //valeur de isLiveOn : boolean

const callback = function (json) {
  if (json.data.length && !isLiveOn) { //on check s'il existe une donnée positive de début de live reçue par le serveur et si la valeur de isLiveOn est "true"
    setIcon('Images/live_on.png');
    chrome.notifications.create('LiveOn', {
      title: 'Wankil est en live !',
      iconUrl: 'Images/live_on.png',
      message: 'Rejoins le live dès maintenant !',
      type: 'basic'
    });
    isLiveOn = true;
  } else { //sinon on laisse tel quel jusqu'à ce que le processus recommence
    setIcon('Images/live_off.png');
    isLiveOn = false;
  }
} //création d'une notification lors du début de live

function fetchTwitchAPI(url, headers, callback){ //fonction créée ici avec 3 settings : l'url, les headers(voir plus haut) et un callback.
  fetch(url, { //fetch envoie une requête à l'adresse déterminée (ici la constante -const- "url")
    headers: headers //les headers de la requête sont ceux reçus en paramètres (voir précédemment)
  }).then((response) => { //la requête engendre une réponse du serveur chez Twitch
      return response.json(); //on "transforme" la réponse de manière à l'exploiter (en json)
  }).then((json) => callback(json)); //on traite la réponse dans un Callback.
}

function setIcon(path) {
  chrome.action.setIcon({ path: path });
}

fetchTwitchAPI(url, headers, callback); //envoi d'une requête à Twitch avec l'url, l'autorisation + Client-ID et callback.

chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({
    url: twitchUrl
  })
});//création d'un bouton cliquable lorsque la notification est lancée - mène à la chaîne Twitch choisie

chrome.alarms.create({ periodInMinutes: 1 }); //Ici c'est assez explicite :)

chrome.alarms.onAlarm.addListener(() => {
  fetchTwitchAPI(url, headers, callback);
}); //Si l'information de début de live est donnépar le serveur, alors fetchTwitchAPI est "lancé".
