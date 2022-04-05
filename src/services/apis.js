const {user_api, gallery_api, play_api, gem_api, achievement_api, quiz_api} = require('../apis')

module.exports = (app) => {

    // Registering route api list
    app.use('/api/user', user_api)
    app.use('/api/play', play_api)
    app.use('/api/gallery', gallery_api)
    app.use('/api/gem', gem_api)
    app.use('/api/achievement', achievement_api)
    app.use('/api/quiz', quiz_api)
}