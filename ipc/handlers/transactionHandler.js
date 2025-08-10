const { safeHandle } = require('../ipcHandlerUtils.js');

safeHandle('get_all_transactions', async (_, where) => {
    return await global.dbAll(`
        SELECT
            t.id, title, t."type", source_id, destination_id, amount, source_balance_after, destination_balance_after, t.note, t.created_at,
            src.name "source_name", dst.name "destination_name"
        FROM transactions t
            LEFT JOIN accounts src ON src.id = source_id
            LEFT JOIN accounts dst ON dst.id = destination_id
        ${where ? 'WHERE ' + where : ''}
        ORDER BY t.created_at DESC
    `);
})

safeHandle('add_income', async (_, { title, amount, destination_id, note = '' }) => {
    try {
        // BASIC VALIDATION
        if (!title) {
            return { success: false, message: 'Saving failed: cant make transaction without title' };
        }
        if (amount <= 0) {
            return { success: false, message: 'Saving failed: cant make zero amounts transaction' };
        }
        const destination = await global.dbGet(`SELECT "type", balance, deleted_at FROM accounts WHERE id = ?`, [destination_id]);
        if (!['cash', 'bank'].includes(destination?.type) || destination.deleted_at) {
            return { success: false, message: 'Saving failed: accounts is not the correct type or it has been deleted.' };
        }

        // INSERT INTO TRANSACTION
        destination_balance_after = destination.balance + amount;
        const queryResult = await global.dbRun(`
            INSERT INTO transactions
            (title, "type", destination_id, amount, destination_balance_after, note, created_at)
            VALUES(?, 'income', ?, ?, ?, ?, CURRENT_TIMESTAMP);
        `, [title, destination_id, amount, destination_balance_after, note]);

        // UPDATE ACCOUNT BALANCE
        await global.dbRun(`UPDATE accounts SET balance=? WHERE id=?;`, [destination_balance_after, destination_id]);

        // GET THE INSERTED TRANSACTION DATA
        const dataResult = await global.dbGet(`SELECT * FROM transactions WHERE id = ?`, [queryResult.lastID]);

        // RETURN RESULT
        return { success: true, message: 'Transaction saved', queryResult: queryResult, dataResult: dataResult };
    } catch (e) {
        return { success: false, message: e.message, error: e };
    }
})

safeHandle('add_expense', async (_, { title, amount, source_id, note = '' }) => {
    try {
        // BASIC VALIDATION
        if (!title) {
            return { success: false, message: 'Saving failed: cant make transaction without title' };
        }
        if (amount <= 0) {
            return { success: false, message: 'Saving failed: cant make zero amounts transaction' };
        }
        const source = await global.dbGet(`SELECT "type", balance, deleted_at FROM accounts WHERE id = ?`, [source_id]);
        if (!['cash', 'bank'].includes(source?.type) || source.deleted_at) {
            return { success: false, message: 'Saving failed: accounts is not the correct type or it has been deleted.' };
        }

        // INSERT INTO TRANSACTION
        source_balance_after = source.balance - amount;
        const queryResult = await global.dbRun(`
            INSERT INTO transactions
            (title, "type", source_id, amount, source_balance_after, note, created_at)
            VALUES(?, 'expense', ?, ?, ?, ?, CURRENT_TIMESTAMP);
        `, [title, source_id, amount, source_balance_after, note]);

        // UPDATE ACCOUNT BALANCE
        await global.dbRun(`UPDATE accounts SET balance=? WHERE id=?;`, [source_balance_after, source_id]);

        // GET THE INSERTED TRANSACTION DATA
        const dataResult = await global.dbGet(`SELECT * FROM transactions WHERE id = ?`, [queryResult.lastID]);

        // RETURN RESULT
        return { success: true, message: 'Transaction saved', queryResult: queryResult, dataResult: dataResult };
    } catch (e) {
        return { success: false, message: e.message, error: e };
    }
})
