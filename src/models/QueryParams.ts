export type QueryParams = {
    /**
     *  Input query params
     */
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: string,
    pageSize: string,
    blogId: string
}