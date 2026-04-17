# MMM-TempsHA

MMM-TempsHA is a MagicMirror² module that displays temperature data from Home Assistant in a clean and modern dashboard style.

![Screenshot](screenshot.png)

## Features

- Fetches temperature sensors from Home Assistant via API
- Displays data in a clean card-based layout
- Dynamic color based on temperature:
  - Blue for cold temperatures
  - Green for normal temperatures
  - Red for high temperatures
- Lightweight and fast

## Requirements

- Home Assistant instance with API access
- Long-lived access token

## Installation

```bash
cd ~/MagicMirror/modules
git clone https://github.com/cobaye49/MMM-TempsHA.git
cd MMM-TempsHA
npm install
```

## Configuration

Edit your MagicMirror config file:

```bash
nano ~/MagicMirror/config/config.js
```
Add the following :

```js
{
 module: "MMM-TempsHA",
 position: "top_center",
 header: "HA Temperature Sensors",
 config: {
  host: "YOUR HA IP",
  token: "YOUR TOKEN",
  entities: [          // feel free to add or remove entities depending on the number of sensors you have
    {
      entity: "sensor.xxx", // remplace by the sensorID
      label: "room name", // remplace by your room name
    },
    {
      entity: "sensor.xxx", // remplace by the sensorID
      label: "room name", // remplace by your room name
    },
    {
      entity: "sensor.xxx", // remplace by the sensorID
      label: "room name", // remplace by your room name
    }
  ]
}
},
```

Restart MagicMirror:
```bash
pm2 restart mm
```

## Notes

- Make sure your Home Assistant API is accessible from your Raspberry Pi
- Ensure your token is valid
- Entities must exist in Home Assistant
