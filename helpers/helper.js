const getPageOffset = (page, listPerPage) => {
    return (page - 1) * listPerPage
}
const emptyOrRows = (rows) => {
    if (rows) {
        return rows
    }
    return []
}

const pagePagination = (page, limit, total) => {
    const firstPage = 1
    const lastPage = Math.ceil(total / limit)
    const hasNext = page < lastPage
    const hasPrev = page > firstPage
    return {
        page: Number(page),
        firstPage,
        lastPage,
        hasNext, 
        hasPrev,
        limit: limit,
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
module.exports = {
    getPageOffset,
    emptyOrRows,
    pagePagination,
    getRandomInt
}
