const { dialog } = require('electron');
const { safeHandle } = require('../ipcHandlerUtils.js');
const path = require("path");
const fs = require("fs");
const { promisify } = require('util');
const sqlite3 = require('@journeyapps/sqlcipher').verbose();

safeHandle('create-db-file', async (_, dbPath, password) => {
	try {
		if (fs.existsSync(dbPath)) {
			return { success: false, error: 'Database already exists at the specified path.' };
		}

		const folder = path.dirname(dbPath);
		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder, { recursive: true });
		}

		return await new Promise((resolve) => {
			const db = new sqlite3.Database(dbPath, (err) => {
				if (err) {
					return resolve({ success: false, error: err.message });
				}

				db.serialize(() => {
					// db.run(`PRAGMA key = '${password}'`);
					// db.run("PRAGMA cipher_compatibility = 4");
					db.run("PRAGMA foreign_keys = ON");

					db.run("CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
					db.run(`
                        INSERT INTO meta (key, value) VALUES
                        ('app_name', 'Finance App'),
                        ('app_version', '1.0.0'),
                        ('username', 'User'),
                        ('total_balance', 0),
						('locale', 'id-ID'),
                        ('currency', 'IDR'),
                        ('last_opened', datetime('now')),
                        ('created_at', datetime('now'))
                    `);

					db.run(`
                        CREATE TABLE accounts (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name TEXT NOT NULL,
                            "type" TEXT NOT NULL,
                            initial_balance REAL DEFAULT 0 NOT NULL,
                            balance REAL DEFAULT 0 NOT NULL,
                            note TEXT,
                            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                            deleted_at TEXT
                        )
                    `);

					db.run(`
                        CREATE TABLE transactions (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
							title TEXT NOT NULL,
                            "type" TEXT NOT NULL,
                            source_id INTEGER,
                            destination_id INTEGER,
                            amount REAL NOT NULL,
							source_balance_after REAL,
                            destination_balance_after REAL,
                            note TEXT,
                            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (source_id) REFERENCES accounts(id),
                            FOREIGN KEY (destination_id) REFERENCES accounts(id)
                        )
                    `);

					db.get(`SELECT count(*) AS count FROM sqlite_master`, (err, _) => {
						db.close();

						if (err) {
							return resolve({ success: false, error: 'Something went wrong while verifying the database.' });
						}

						global.financeDB = db;
						return resolve({ success: true });
					});
				});
			});
		});
	} catch (e) {
		return { success: false, error: e.message };
	}
});

safeHandle('login-with-db-file', async (_, dbPath, password) => {
	if (!fs.existsSync(dbPath)) {
		return { success: false, error: 'Database file does not exist.' };
	}

	return await new Promise((resolve) => {
		const db = new sqlite3.Database(dbPath, (err) => {
			if (err) {
				return resolve({ success: false, error: 'Failed to open database: ' + err.message });
			}

			db.serialize(() => {
				// db.run(`PRAGMA key = '${password}'`);

				db.all('SELECT * FROM meta', (err, rows) => {
					if (err) {
						db.close(() => {
							resolve({ success: false, error: 'Failed to load metadata, this can be caused by wrong password or corrupted database.' });
						});
					} else {
						global.db = db;
						global.dbAll = promisify(db.all).bind(db);
						global.dbGet = promisify(db.get).bind(db);
						global.dbRun = (sql, params = []) => {
							return new Promise((resolve, reject) => {
								db.run(sql, params, function (err) {
									if (err) return reject(err);
									resolve({ lastID: this.lastID, changes: this.changes });
								});
							});
						}
						global.dbExec = promisify(db.exec).bind(db);
						let metaData = {};
						for (const row of rows) {
							metaData[row.key] = row.value;
						}
						metaData['db_file_name'] = path.basename(dbPath);
						global.sharedData.metaData = metaData;

						resolve({ success: true });
					}
				});
			});
		});
	});
});

safeHandle('logout', async () => {
	delete global.sharedData.metaData;
	global.db.close();
	return;
})
