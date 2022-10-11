export const giveSkipNumber = (pageNumber: string,
                               pageSize: string) => {

    return (Number(pageNumber) - 1) * Number(pageSize)
}

export const givePagesCount = (totalCount: number, pageSize: string) => {
    return Math.ceil(totalCount / Number(pageSize))
}

