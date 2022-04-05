
const format = {
    data: [],
    status: 200,
    msg: "",
}

module.exports = (form = format) => {
    
    let ret = format

    if(form.status === 404) {
        ret = {
            status: form.status,
            msg: form.msg
        }
    } else {
        ret = {...ret, ...form}
    }

    return ret
}