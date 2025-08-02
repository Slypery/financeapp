const { dialog } = require('electron');
const { safeHandle } = require('../ipcHandlerUtils.js');
const path = require('path');

safeHandle('select-path', async (_, options = {}) => {
	const { filters = [], properties = ['openFile'] } = options;

	const result = await dialog.showOpenDialog({
		filters,
		properties
	});

	if (result.canceled || result.filePaths.length === 0) return null;

	return result.filePaths[0];
});

safeHandle('path-join', (_, segments) => {
	return path.join(...segments);
});

safeHandle('ext-name', (_, file) => {
	return path.extname(file);
})