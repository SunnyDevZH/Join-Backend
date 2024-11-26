/** Server*/
const STORAGE_TOKEN = 'HXZH6LGQSB8KPYZZ39S7IBUKJD8VHEQUH375LYY8';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item'; // URL Backend

/** Push to Server*/
async function setItem(key, value) { // Key und Value speicher unter Storage
    const payload = { key, value, token: STORAGE_TOKEN }; // Token immer angeben
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }) // fetch = laden -> Storage_URl -> Methode Post = senden -> payload als string an Backend
        .then(res => res.json()); // res = Response in ein Jason umwandeln
}

/** Pull from Server*/
async function getItem(key) { // Key wieder holen von Storage
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`; // Zugriff auf Storage_Url -> Key und ${Key} und token ${Storage_tocken}
    return fetch(url).then(res => res.json()).then(res => { // Laden URL mit inhalt Key // res = Response in ein Jason umwandeln
        // Verbesserter code
        if (res.data) {  // 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}