const generate_id = (length) => {

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let id = ""

    for(let i = 0; i< (length || 16); i++) {
        let random = Math.floor(Math.random()*chars.length)
        id = id + chars[random]
    }
    
    return id
}

module.exports = {
    generate_id
}