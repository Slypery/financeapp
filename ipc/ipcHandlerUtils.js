const { ipcMain } = require('electron');

const registeredHandlers = new Map();

function safeHandle(channel, handler) {
	if (registeredHandlers.has(channel)) {
		ipcMain.removeHandler(channel);
	}

	ipcMain.handle(channel, handler);
	registeredHandlers.set(channel, handler);
}

function removeAllSafeHandlers() {
	for (const channel of registeredHandlers.keys()) {
		ipcMain.removeHandler(channel);
		registeredHandlers.delete(channel);
	}
}

module.exports = { safeHandle, removeAllSafeHandlers };