/* eslint-disable no-undef */
function handleDebugMessage(message, option) {
  process.stderr.write(`${option}: ${message}\n`);
}

module.exports = handleDebugMessage;
