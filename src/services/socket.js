module.exports = (server) => {
    
    const { Server } = require("socket.io");
    const io = new Server(server);

    // Starting service ...

    io.on('connection', (socket) => {
        
        console.log('[SOCKET]: A device join');

        socket.on('register', (id) => {
            
            console.log(`[${id}]: Registering ...`)
        })
    });
}