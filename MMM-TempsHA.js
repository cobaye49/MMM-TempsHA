Module.register("MMM-TempsHA", {

  defaults: {
    host: "",
    token: "",
    entities: []
  },

  start: function () {
    this.dataTemps = [];

    this.getData();

    setInterval(() => {
      this.getData();
    }, 30000);
  },

  getData: function () {
    this.sendSocketNotification("GET_TEMPS", this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "TEMPS_RESULT") {
      this.dataTemps = payload;
      this.updateDom();
    }
  },

  getDom: function () {

    const wrapper = document.createElement("div");

    if (!this.dataTemps.length) {
      wrapper.innerHTML = "Chargement...";
      return wrapper;
    }

    const grid = document.createElement("div");
    grid.style.display = "flex";
    grid.style.gap = "20px";
    grid.style.flexWrap = "wrap";

    this.dataTemps.forEach(item => {

      const configItem = this.config.entities.find(e =>
        (typeof e === "string" ? e : e.entity) === item.entity
      );

      const label = typeof configItem === "object"
        ? configItem.label || item.entity
        : item.entity;

      const value = parseFloat(item.state);

      const card = document.createElement("div");
      card.style.background = "#111";
      card.style.padding = "12px";
      card.style.borderRadius = "12px";
      card.style.textAlign = "center";
      card.style.minWidth = "100px";

      const name = document.createElement("div");
      name.innerHTML = label;
      name.style.fontSize = "14px";

      const temp = document.createElement("div");

      if (isNaN(value)) {
        temp.innerHTML = "—";
        temp.style.color = "#888";
      } else {
        let color = "#2ecc71";
        if (value >= 25) color = "#e74c3c";
        else if (value <= 18) color = "#3498db";

        temp.innerHTML = `${value}°C`;
        temp.style.color = color;
      }

      temp.style.fontSize = "20px";
      temp.style.fontWeight = "bold";

      card.appendChild(name);
      card.appendChild(temp);

      grid.appendChild(card);
    });

    wrapper.appendChild(grid);

    return wrapper;
  }
});
