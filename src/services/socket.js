const { Galleries, Users } = require("../databases");

module.exports = (server, app) => {
    
    const { Server } = require("socket.io");
    const io = new Server(server);

    // parse socket to (req) request router, so we can access the socket action
    app.socket = io;

    // Socket listen ...

    io.on('connection', (socket) => {
        
        console.log(`[SOCKET - ${socket.id}]: A device join`);

        // Server listen when device client (raspberry) registering and put the device socket on gallery items
        socket.on('register', ({room_id, device_id}) => {
            console.log(`[${device_id}]: Registering ...`)
            Galleries.findOneAndUpdate({room_id}, {device_socket: socket.id}).catch(err => console.log(`[${device_id}]: Registering socket failed - ${err}`))
        })

        // Server listen when device client (raspberry) is successfully open the door that user requested and decrease the user gem
        socket.on('door_opened', (uuid) => {

            Users.findOne({uuid})
            .then(user => {
                if (user) {
                    user.gem -= 5;
                    user.save().catch(err => console.log('[SOCKET - UPDATE USER]: ' + err))
                }
            }).catch(err => console.log('[SOCKET - UPDATE USER]: ' + err))
        })
        
        // Server listen when device client (raspberry) is disconnected and delete the device_socket on gallery items
        socket.on('disconnect', () => {
            
            console.log(`[${socket.id}]: Disconnected`)
            Galleries.findOneAndUpdate({device_socket: socket.id}, {device_socket: ""}).catch(err => console.log(`[${socket.id}]: Delete socket failed - ${err}`))
        });
    });
}