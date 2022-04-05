const generate_id = (length) => {

    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    let id = ""

    // Generate random char with given length
    for(let i = 0; i< (length || 16); i++) {
        let random = Math.floor(Math.random()*chars.length)
        id = id + chars[random]
    }
    
    // Return the result
    return id
}

module.exports = {
    generate_id
}