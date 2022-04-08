const cron = require('node-cron')
const { Gems } = require('../databases')
const { schedule } = cron
const axios = require('axios').default

const suffleGems = schedule('*/5 * * * *', async () => {
    
    // Suffle gem type
    const Gem = await Gems.find()
    Gem.forEach(async (item, index) => {
        item.type !== 2 && await Gems.findByIdAndUpdate(item._id, {type: Math.floor(Math.random()*2)})  
    })
})

const suffleSecretGems = schedule('30 17 * * *', async () => {

    // Suffle secret gem
    const Gem = await Gems.find()
    Gem.forEach(async (item, _) => {
        if (item.type === 2) await Gems.findByIdAndUpdate(item.id, {type: 0})
    })

    await Gems.findByIdAndUpdate(Gem[Math.floor(Math.random()*Gem.length)].id, {type: 2}).catch(err => console.log(err))
})

const resetGems = schedule('*/6 * * * *', async () => {

    // Suffle secret gem
    await Gems.updateMany(
        { type: { $ne: 2 } }, 
        { type: 0 }
    ).catch(err => console.log(err))
})

const keepAwake = schedule('*/5 * * * *', () => {

    // Awake
    axios.post('https://rosemary18-keep-awake.herokuapp.com', {callback: 'https://fop-server-id.herokuapp.com'})
         .then(() => console.log('Ignore idling ...'))
         .catch(err => console.log(err))
})

const start = () => {

    // Start schedule functions
    suffleGems.start()
    suffleSecretGems.start()
    resetGems.start()
    keepAwake.start()
}

const stop = () => {

    // Stop schedule functions
    suffleGems.stop()
    suffleSecretGems.stop()
    resetGems.stop()
}

module.exports = {
    start,
    stop
}