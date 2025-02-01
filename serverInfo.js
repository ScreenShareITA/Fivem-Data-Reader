
const endpointInput = document.getElementById('input-list');
const refreshButton = document.getElementById('refresh-button');
const dataContainer = document.getElementById('data-container');

const baselink = "https://servers-frontend.fivem.net/api/servers/single/";
const baseiconlink = "https://servers-live.fivem.net/servers/icon/";
const baseconnectlink = "https://cfx.re/join/";
const basedetailslink = "https://servers.fivem.net/servers/detail/";




async function readData() {
  const endpoint = endpointInput.value.trim(); //raccolgo endpoint
  if (!endpoint) {
    alert("Inserisci un endpoint valido!");
    return;
  } // controllo se esiste endpoint e non è vuoto

  try {
    const response = await fetch(baselink + endpoint); // richiesta a fivem
    if (!response.ok) {
      throw new Error("Errore nel recupero dei dati");
    } // controllo che il testo ci sia
    const data = await response.json(); // prendo la risposta json

    dataContainer.innerHTML = ''; // pulisco il div da output in modo da non sovrapporre risultati 

    displayData(data); // chiamata alla funzione che scrive i dati

  } catch (error) {
    console.error("Errore:", error); // se c'è un errore ri scrive in console
    alert("Errore nel recupero dei dati. Controlla l'endpoint e riprova."); // e avvisa con alert
  }
}
function displayData(response) {
  const endpoint = response.EndPoint;
  const data = response.Data;
  const serveravatar = baseiconlink + endpoint + '/' + data.iconVersion + ".png";
  const connectlink = baseconnectlink + endpoint;
  const details = basedetailslink + endpoint;
  const firstip = "http://" + data.connectEndPoints[0];

  const generalInfo = `
    <div class="data-section">
      <h2>Dati estratti</h2>
      <p><strong>Hostname:</strong> ${data.hostname.replace(/\^./g, "")}</p>
      <p><strong>Giocatori connessi:</strong> ${data.clients} / ${data.sv_maxclients}</p>
      <p><strong>Owner:</strong> <a href="${data.ownerAvatar}" target="_blank"><img src="${data.ownerAvatar}" alt="Owner Avatar"></a> <a href="${data.ownerProfile}" target="_blank">${data.ownerName}</a> (OwnerID = ${data.ownerID})</p>
      <p><strong>Server:</strong> <a href="${serveravatar}" target="_blank"><img src="${serveravatar}" alt="Server Avatar"></a> <a href="${connectlink}" target="_blank">Connect</a> <a href="${details}" target="_blank">Details</a> <a href="${firstip+"/info.json"}" target="_blank">Info.json</a> <a href="${firstip+"/players.json"}" target="_blank">Player.json</a> <a href="${firstip+"/dynamic.json"}" target="_blank">Dynamic.json</a> <a href="${baselink+endpoint}" target="_blank">Main JSON</a> (Endpoints = ${(data.connectEndPoints).join(', ')})</p>
      <p><strong>Ultimo aggiornamento:</strong> <strong style="color: #cc6060">${new Date(data.lastSeen).toLocaleString()}</strong></p>
      <p><strong>Altre info:</strong></p>
      <ul>
        <li><p><strong>Server:</strong> ${data.server}</p></li>
        <li><p><strong>Game Type:</strong> ${data.gametype}</p></li>
        <li><p><strong>Map Name:</strong> ${data.mapname}</p></li>
        <li><p><strong>enhancedHostSupport:</strong> ${data.enhancedHostSupport}</p></li>
        <li><p><strong>requestSteamTicket:</strong> ${data.requestSteamTicket}</p></li>
        <li><p><strong>selfReportedClients:</strong> ${data.selfReportedClients}</p></li>
        <li><p><strong>upvotePower:</strong> ${data.upvotePower}</p></li>
        <li><p><strong>burstPower:</strong> ${data.burstPower}</p></li>
        <li><p><strong>support_status:</strong> ${data.support_status}</p></li>
        <li><p><strong>suspendedTill:</strong> ${data.suspendedTill}</p></li>
      </ul>
      <h2>Server Vars</h2>
      <ul>
        ${Object.entries(data.vars).map(([key,value]) => `<li><p><strong>${key}:</strong> ${value}</p></li>`).join('')}
      </ul>
    </div>
  `; // creo html per info generali
  dataContainer.innerHTML += generalInfo; // inserisco l'html per info generali
  const resources = `
    <div class="data-section">
      <h2>Risorse</h2>
      <div class="resource-list">
        ${data.resources.map(resource => `<div class="resource-item">${resource}</div>`).join('')}
      </div>
    </div>
  `; // creo html risorse con iterazione con map
  dataContainer.innerHTML += resources; // inserisco html risorse

  const players = `
    <div class="data-section">
      <h2>Giocatori</h2>
      <div class="player-grid">
        ${data.players.map(player => `
          <div class="player-card">
            <h3>${player.name}</h3>
            ${Object.entries(player)
              .filter(([key, value]) => !Array.isArray(value)) // Filtra gli array (es. identifiers)
              .map(([key, value]) => `
                <p><strong>${key}:</strong> ${value}</p>
              `).join('')}
            ${player.identifiers && player.identifiers.length > 0 ? `
              <div class="identifiers-section">
                <h4>Identifiers</h4>
                ${player.identifiers.map(id => {
                  const [key, value] = id.split(':');
                  return `<p><strong>${key}:</strong> ${value}</p>`;
                }).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;// casino per creare codice html player
  dataContainer.innerHTML += players; // inserisco codice html player
}


// Aggiungi event listener
endpointInput.addEventListener('change', readData);
refreshButton.addEventListener('click', readData);
