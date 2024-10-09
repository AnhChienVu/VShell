function handleDebugMessage(message, option) {
  process.stderr.write(`${option}: ${message}\n`);
}

module.exports = handleDebugMessage;
