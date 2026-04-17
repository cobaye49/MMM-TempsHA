const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

  start: function () {
    console.log("✅ Node helper MMM-TempsHA OK");
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "GET_TEMPS") {
      this.getTemps(payload);
    }
  },

  async getTemps(config) {
    try {
      const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

      const entities = config.entities;
      let result = {};

      for (let entity of entities) {
        const res = await fetch(`http://${config.host}:8123/api/states/${entity}`, {
          headers: {
            Authorization: `Bearer ${config.token}`
          }
        });

        const text = await res.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("❌ JSON invalide :", text);
          continue;
        }

        result[entity] = data.state;
      }

      this.sendSocketNotification("TEMPS_RESULT", result);

    } catch (err) {
      console.error("❌ Erreur HA:", err);
    }
  }

});
