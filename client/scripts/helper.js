function formatDate(input) {
    const d = new Date(input)
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    if( d.getDate().toString().length == 1) {
        return ` ${month[d.getMonth()]} 0${d.getDate()}`
    }

    return ` ${month[d.getMonth()]} ${d.getDate()}`
}

function progressDueDate(obj) {
    const createdAt = new Date(obj.createdAt)
    const dueDate = new Date(obj.dueDate)
    const now = new Date()
    const {status} = obj

    

    if(status == true) return 'width:100%; background-color:#09c143'
    if(dueDate < now) {
        return 'width:100%; background-color:#bc1e35'
    } else {
        const deltaNow = now - createdAt
        const delta = dueDate - createdAt
        const percentage = deltaNow/delta*100

        if(percentage < 0) {return 'width:0%;'}
        if(percentage > 100) {return 'width:100%'}

        
        return `width:${percentage.toFixed(0)}%`
    }
}