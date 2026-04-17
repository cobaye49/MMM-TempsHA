Module.register("MMM-TempsHA", {

  defaults: {
    host: "",
    token: "",
    entities: []
  },

  start: function () {
    console.log("✅ MMM-TempsHA chargé");

    this.temps = {};

    this.getData();

    setInterval(() => {
      this.getData();
    }, 30000);
  },

  getData: function () {
    this.sendSocketNotification("GET_TEMPS", this.config);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "TEMPS_RESULT") {
      console.log("📩 Données reçues :", payload);
      this.temps = payload;
      this.updateDom();
    }
  },

  getDom: function () {
  const wrapper = document.createElement("div");

  // ===== LOADING =====
  if (Object.keys(this.temps).length === 0) {
    const loading = document.createElement("div");
    loading.innerHTML = "Chargement...";
    loading.style.textAlign = "center";
    wrapper.appendChild(loading);
    return wrapper;
  }

  // ===== CONTAINER GRID =====
  const grid = document.createElement("div");
  grid.style.display = "flex";
  grid.style.justifyContent = "center";
  grid.style.gap = "20px";

  const names = {
    "sensor.temp_chambre_temperature": "Chambre",
    "sensor.temp_dahlia_temperature": "Dahlia",
    "sensor.temp_salon_temperature": "Salon"
  };

  // ===== CARTES =====
  for (let entity in this.temps) {

    const value = parseFloat(this.temps[entity]);

    // couleur dynamique
    let color = "#2ecc71"; // normal
    if (value >= 25) color = "#e74c3c";
    else if (value <= 18) color = "#3498db";

    const card = document.createElement("div");
    card.style.background = "#111";
    card.style.padding = "12px";
    card.style.borderRadius = "12px";
    card.style.textAlign = "center";
    card.style.minWidth = "90px";
    card.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

    const name = document.createElement("div");
    name.innerHTML = names[entity] || entity;
    name.style.fontSize = "14px";
    name.style.marginBottom = "6px";

    const temp = document.createElement("div");
    temp.innerHTML = `${value}°C`;
    temp.style.fontSize = "20px"; // 🔽 réduit
    temp.style.fontWeight = "bold";
    temp.style.color = color;

    card.appendChild(name);
    card.appendChild(temp);

    grid.appendChild(card);
  }

  wrapper.appendChild(grid);

  return wrapper;
}

});
