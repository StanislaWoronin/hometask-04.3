import {Request} from "express";
import {InputParametersType} from "./types/inputParameters-type";

export const giveInputParameters = (req: Request) => {
    const inputParameters = <InputParametersType>{}

    const params = req.params
    const body = req.body
    const query = req.query

    if (!params.id) {
        inputParameters.id = body.id
    }

    // Blogs body input parameters
    if (!body.name) {
        inputParameters.name = body.name
    }

    if (!body.youtubeUrl) {
        inputParameters.youtubeUrl = body.youtubeUrl
    }

    // Posts body input parameters
    if (!body.title) {
        inputParameters.title = body.title
    }

    if (!body.shortDescription) {
        inputParameters.shortDescription = body.shortDescription
    }

    if (!body.content) {
        inputParameters.content = body.content
    }

    if (body.blogId) {
        inputParameters.blogId = body.blogId
    }

    // Query parameters
    inputParameters.pageNumber = Number(query.pageNumber)
    inputParameters.pageSize = Number(query.pageSize)
    inputParameters.sortBy = <string>query.sortBy
    inputParameters.sortDirection = query.sortDirection === 'asc' ? 1 : -1

    return inputParameters
}