class Logger {

    backend(...messages) {
        console.log(`\x1b[37m[\x1b[34mBACKEND\x1b[0m\x1b[37m]`, ...messages);
    }

    debug(...messages) {
        console.log(`\x1b[37m[\x1b[36mDebug\x1b[0m\x1b[37m],`, ...messages);
    }
}

module.exports = new Logger();