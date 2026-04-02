let serialPort;
let serialWriter;
let serialReaderActive = false;

const statusElement = document.getElementById('connection-status');
const lastUpdateElement = document.getElementById('last-update');
const applyButton = document.getElementById('apply-button');
const connectButton = document.getElementById('connect-button');
const refreshButton = document.getElementById('refresh-button');
const temperatureInput = document.getElementById('temperature');

function setStatus(message, variant) {
  statusElement.textContent = message;
  statusElement.className = `status status--${variant}`;
}

function setLastUpdate(date = new Date()) {
  lastUpdateElement.textContent = `Derniere releve: ${date.toLocaleTimeString('fr-CA')}`;
}

function setZoneState(zone, label, variant) {
  const badge = document.getElementById(`zone-${zone}-status`);
  const card = document.getElementById(`zone-${zone}-card`);

  if (!badge || !card) {
    return;
  }

  badge.textContent = label;
  badge.className = `zone-card__badge zone-card__badge--${variant}`;
  card.classList.remove('zone-card--ok', 'zone-card--error');

  if (variant === 'ok') {
    card.classList.add('zone-card--ok');
  }

  if (variant === 'error') {
    card.classList.add('zone-card--error');
  }
}

function updateZoneValue(zone, value) {
  const target = document.getElementById(`zone-${zone}-value`);

  if (!target) {
    return;
  }

  if (value === 'ERROR') {
    target.textContent = 'Erreur capteur';
    setZoneState(zone, 'Capteur indisponible', 'error');
    return;
  }

  const parsedValue = Number.parseFloat(value);

  if (Number.isNaN(parsedValue)) {
    return;
  }

  target.textContent = `${parsedValue.toFixed(1)} °C`;
  setZoneState(zone, 'Mesure recue', 'ok');
  setLastUpdate();
}

function handleSerialLine(line) {
  const trimmed = line.trim();

  if (!trimmed.startsWith('ZONE_')) {
    return;
  }

  const [zoneLabel, value] = trimmed.split(':');
  const zone = zoneLabel.replace('ZONE_', '');

  updateZoneValue(zone, value);
}

async function readSerialLoop() {
  if (serialReaderActive) {
    return;
  }

  serialReaderActive = true;
  const textDecoder = new TextDecoder();
  const reader = serialPort.readable.getReader();
  let buffer = '';

  try {
    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      buffer += textDecoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      lines.forEach(handleSerialLine);
    }
  } catch (error) {
    console.error(error);
    setStatus('Lecture serie interrompue', 'error');
  } finally {
    serialReaderActive = false;
    reader.releaseLock();
  }
}

async function sendCommand(command) {
  if (!serialWriter) {
    setStatus('Connecte d abord l Arduino', 'error');
    return;
  }

  const encoder = new TextEncoder();
  await serialWriter.write(encoder.encode(`${command}\n`));
}

async function connectToArduino() {
  if (!('serial' in navigator)) {
    setStatus('Web Serial non pris en charge par ce navigateur', 'error');
    return;
  }

  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 9600 });

    serialWriter = serialPort.writable.getWriter();

    setStatus('Arduino connecte', 'connected');
    setLastUpdate(new Date());
    readSerialLoop();
    await sendCommand('READ_NOW');
  } catch (error) {
    console.error(error);
    setStatus('Connexion impossible', 'error');
  }
}

connectButton.addEventListener('click', connectToArduino);

refreshButton.addEventListener('click', async () => {
  await sendCommand('READ_NOW');
});

applyButton.addEventListener('click', () => {
  const value = temperatureInput.value.trim();

  if (!value) {
    setStatus('Entre une temperature cible avant d appliquer', 'error');
    return;
  }

  setStatus(`Consigne recue: ${value} °C`, 'connected');
});
