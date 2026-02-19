let themeBtn;

window.onload = function () {
  themeBtn = document.getElementById("themeBtn");

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  }
};

function toggleDarkMode() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeBtn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
}

const socket = io();
const markers = {};

let map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      socket.emit("send-location", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    (error) => console.log(error),
    { enableHighAccuracy: true }
  );
}

socket.on("receive-location", (data) => {
  const position = [data.latitude, data.longitude];

  if (markers[data.id]) {
    markers[data.id].setLatLng(position);
  } else {
    markers[data.id] = L.marker(position).addTo(map);
  }

  map.setView(position, 15);
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
