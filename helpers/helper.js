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

module.exports = {
    getPageOffset,
    emptyOrRows,
    pagePagination

}