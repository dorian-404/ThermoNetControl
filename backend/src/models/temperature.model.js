const temperatures = [];

function getLatest() {
  return temperatures[temperatures.length - 1] || null;
}

function create(payload) {
  const entry = {
    id: temperatures.length + 1,
    value: Number(payload.value),
    createdAt: new Date().toISOString(),
  };

  temperatures.push(entry);
  return entry;
}

module.exports = {
  getLatest,
  create,
};
