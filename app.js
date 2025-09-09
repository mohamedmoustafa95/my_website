// ✅ Initialize the map
const map = L.map("map").setView([30.0444, 31.2357], 5); // Default: Cairo, Egypt

// ✅ Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
}).addTo(map);

// ✅ Function to generate random rain probability
function getRainProbability() {
  return Math.floor(Math.random() * 101); // 0 → 100 %
}

// ✅ Function to format time
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}

// ✅ Add click event on map
map.on("click", function (e) {
  const lat = e.latlng.lat.toFixed(2);
  const lon = e.latlng.lng.toFixed(2);
  const rainProb = getRainProbability();
  const time = getCurrentTime();

  // Show result in the "result" section
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <h3>📍 Location: (${lat}, ${lon})</h3>
    <p>🌧️ Rain Probability: <strong>${rainProb}%</strong></p>
    <p>🕒 Time: ${time}</p>
  `;

  // Add marker on the map
  const marker = L.marker([lat, lon])
    .addTo(map)
    .bindPopup(`Rain: ${rainProb}%<br>(${lat}, ${lon})`)
    .openPopup();

  // Add row to Prediction History table with Delete button
  const historyTable = document.querySelector("#history-table tbody");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${lat}</td>
    <td>${lon}</td>
    <td>${rainProb}%</td>
    <td>${time}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;
  historyTable.appendChild(newRow);

  // Delete button functionality
  newRow.querySelector(".delete-btn").addEventListener("click", () => {
    map.removeLayer(marker); // Remove marker from map
    newRow.remove();         // Remove row from table
    removeFromLocalStorage(lat, lon, rainProb, time); // Remove from storage
  });

  // Save to localStorage
  saveToLocalStorage(lat, lon, rainProb, time);
});

// ✅ Local Storage Save & Load
function saveToLocalStorage(lat, lon, rainProb, time) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push({ lat, lon, rainProb, time });
  localStorage.setItem("history", JSON.stringify(history));
}

function removeFromLocalStorage(lat, lon, rainProb, time) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history = history.filter(
    item =>
      !(item.lat == lat && item.lon == lon && item.rainProb == rainProb && item.time == time)
  );
  localStorage.setItem("history", JSON.stringify(history));
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  const historyTable = document.querySelector("#history-table tbody");
  history.forEach(item => {
    const marker = L.marker([item.lat, item.lon])
      .addTo(map)
      .bindPopup(`Rain: ${item.rainProb}%<br>(${item.lat}, ${item.lon})`);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.lat}</td>
      <td>${item.lon}</td>
      <td>${item.rainProb}%</td>
      <td>${item.time}</td>
      <td><button class="delete-btn">Delete</button></td>
    `;
    historyTable.appendChild(row);

    // Delete button
    row.querySelector(".delete-btn").addEventListener("click", () => {
      map.removeLayer(marker);
      row.remove();
      removeFromLocalStorage(item.lat, item.lon, item.rainProb, item.time);
    });
  });
}

loadHistory();

// ✅ Smooth scroll for navbar links
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 50,
        behavior: "smooth",
      });
    }
  });
});

// ✅ Fake form submit
const form = document.querySelector("#contact form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("✅ Your message has been sent successfully!");
  form.reset();
});

// ✅ Dark Mode Toggle
const modeToggle = document.getElementById("mode-toggle");
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  modeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
});
