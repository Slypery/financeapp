const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	// generalHandlers.js
	sharedData: () => ipcRenderer.invoke('shared-data'),

	// fileFolderAndPathHandlers
	selectPath: (options) => ipcRenderer.invoke('select-path', options),
	pathJoin: (...segments) => ipcRenderer.invoke('path-join', segments),
	extName: (p) => ipcRenderer.invoke('ext-name', p),

	// auth
	auth: {
		createDBFile: (db_path, password) => ipcRenderer.invoke('create-db-file', db_path, password),
		loginWithDBFile: (db_path, password) => ipcRenderer.invoke('login-with-db-file', db_path, password),
		logout: () => ipcRenderer.invoke('logout'),
	},

	// transaction
	transaction: {
		getAll: (where) => ipcRenderer.invoke('get_all_transactions', where),
		addIncome: (data) => ipcRenderer.invoke('add_income', data),
		addExpense: (data) => ipcRenderer.invoke('add_expense', data),
	},

	// accounts/sources of fund
	accounts: {
		all: (where) => ipcRenderer.invoke('get-all-accounts', where),
	},
});