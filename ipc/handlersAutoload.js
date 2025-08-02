const path = require('path');
const fs = require('fs');

const handlersDir = path.join(__dirname, 'handlers');

function loadHandlers(messagePrefix = 'Loaded') {
    fs.readdirSync(handlersDir).forEach(file => {
        const fullPath = path.join(handlersDir, file);
        if (file.endsWith('.js')) {
            delete require.cache[require.resolve(fullPath)];
            require(fullPath);
            console.log(`[handlers autoload] ${ messagePrefix } ${ file }`);
        }
    });
}

loadHandlers();

if (process.env.NODE_ENV === 'development') {
    const chokidar = require('chokidar');

    let reloadTimeout;
    chokidar.watch(handlersDir).on('change', (filePath) => {
        clearTimeout(reloadTimeout);
        reloadTimeout = setTimeout(() => {
            console.log(`[handlers autoload] Detected change in ${ filePath }`);
            loadHandlers('Reloaded');
        }, 300);
    });
}