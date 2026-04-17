const NodeHelper = require("node_helper");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = NodeHelper.create({

  start: function () {
    console.log("MMM-TempsHA helper OK");
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_TEMPS") {
      this.getTemps(payload);
    }
  },

  async getTemps(config) {
    try {
      const promises = config.entities.map(async (item) => {

        const entity = typeof item === "string" ? item : item.entity;

        const res = await fetch(
          `http://${config.host}:8123/api/states/${entity}`,
          {
            headers: {
              Authorization: `Bearer ${config.token}`
            }
          }
        );

        if (!res.ok) {
          return {
            entity,
            state: "error"
          };
        }

        const data = await res.json();

        return {
          entity,
          state: data.state
        };
      });

      const results = await Promise.all(promises);

      this.sendSocketNotification("TEMPS_RESULT", results);

    } catch (err) {
      console.error("HA error:", err);
    }
  }

});
