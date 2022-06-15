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

const generate_quest = (room) => {

    const samples = [
        `Arum ingin pergi ke ruangan ${room} untuk bertemu dengan ketua BEM, bantu arum menemukan ruangan ${room}`,
        `Arum akan bertemu dengan dosen pembimbingnya, bantu arum menemukan ruangan ${room}`,
        `Ruangan ${room} akan menjadi tempat diselenggarakan mediasi antar himpunan organisasi, arum menjadi panitia untuk menyiapkan acara. bantu arum menemukan ruangan ${room}`,
        `Arum ingin pergi ke ruangan ${room}, bantu arum menemukan ruangan ${room}`,
        `Malam ini Arum harus mengikuti sesi pertemuan di ruangan ${room}, bantu arum menemukan ruangan ${room}`,
    ]

    return samples[Math.floor(Math.random()*samples.length)]+`. \n Petunjuk: Ruangan berada di lantai ${room[0]}`
}

module.exports = {
    generate_id,
    generate_quest
}