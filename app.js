// Map initialization
const map = L.map("map").setView([30.0444, 31.2357], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
}).addTo(map);

// Storage for markers
const markers = new Map(); // key: unique id, value: marker

function getRainProbability() { return Math.floor(Math.random() * 101); }
function getCurrentTime() { return new Date().toLocaleTimeString(); }

function saveToLocalStorage(id, lat, lon, rainProb, time) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push({ id, lat, lon, rainProb, time });
  localStorage.setItem("history", JSON.stringify(history));
}

function removeFromLocalStorage(id) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history = history.filter(item => item.id !== id);
  localStorage.setItem("history", JSON.stringify(history));
}

function addHistoryRow(id, lat, lon, rainProb, time) {
  const tbody = document.querySelector("#history-table tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${lat}</td>
    <td>${lon}</td>
    <td>${rainProb}%</td>
    <td>${time}</td>
    <td><button class="delete-btn">✖️</button></td>
  `;
  tbody.appendChild(row);

  // Create marker and store reference
  const marker = L.marker([lat, lon]).addTo(map)
    .bindPopup(`Rain: ${rainProb}%<br>(${lat}, ${lon})`);
  markers.set(id, marker);

  // Delete button
  row.querySelector(".delete-btn").addEventListener("click", () => {
    row.remove();
    map.removeLayer(marker); // Remove marker from map
    markers.delete(id);
    removeFromLocalStorage(id);
  });
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.forEach(item => addHistoryRow(item.id, item.lat, item.lon, item.rainProb, item.time));
}

// Generate unique ID for each row
function generateId() { return Date.now() + Math.random().toString(16).slice(2); }

// Map click
map.on("click", function(e) {
  const lat = e.latlng.lat.toFixed(2);
  const lon = e.latlng.lng.toFixed(2);
  const rainProb = getRainProbability();
  const time = getCurrentTime();
  const id = generateId();

  addHistoryRow(id, lat, lon, rainProb, time);
  saveToLocalStorage(id, lat, lon, rainProb, time);

  document.getElementById("result").innerHTML = `
    <h3>📍 Location: (${lat}, ${lon})</h3>
    <p>🌧️ Rain Probability: <strong>${rainProb}%</strong></p>
    <p>🕒 Time: ${time}</p>
  `;
});

loadHistory();
