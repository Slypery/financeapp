const { dialog } = require('electron');
const { safeHandle } = require('../ipcHandlerUtils.js');

safeHandle('shared-data', () => {
    return global.sharedData;
});