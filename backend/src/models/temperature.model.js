const temperatures = [];

function getLatest() {
  return temperatures[temperatures.length - 1] || null;
}

function getLatestByZone() {
  const latestByZone = new Map();

  for (const entry of temperatures) {
    latestByZone.set(entry.zone, entry);
  }

  return Array.from(latestByZone.values()).sort((left, right) => left.zone - right.zone);
}

function create(payload) {
  const entry = {
    id: temperatures.length + 1,
    zone: Number(payload.zone),
    value: Number(payload.value),
    createdAt: new Date().toISOString(),
  };

  temperatures.push(entry);
  return entry;
}

module.exports = {
  getLatest,
  getLatestByZone,
  create,
};
