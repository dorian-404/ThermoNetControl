let serialPort;
let serialWriter;

const statusElement = document.getElementById('connection-status');
const applyButton = document.getElementById('apply-button');
const connectButton = document.getElementById('connect-button');
const refreshButton = document.getElementById('refresh-button');
const temperatureInput = document.getElementById('temperature');

function setStatus(message, variant) {
  statusElement.textContent = message;
  statusElement.className = `status status--${variant}`;
}

function updateZoneValue(zone, value) {
  const target = document.getElementById(`zone-${zone}-value`);

  if (!target) {
    return;
  }

  target.textContent = value === 'ERROR' ? 'Erreur capteur' : `${value} °C`;
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
    readSerialLoop();
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
