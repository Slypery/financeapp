const { safeHandle } = require('../ipcHandlerUtils.js');

safeHandle('get-all-accounts', async (_, where) => {
    return await global.dbAll(`SELECT * FROM accounts ${where ? 'WHERE ' + where : ''}`);
});