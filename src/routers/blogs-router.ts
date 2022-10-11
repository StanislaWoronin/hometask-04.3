import {Response, Router} from "express";

import {blogRouterValidation} from "../middlewares/blogRouter-validation-middleware";
import {postForBlogValidation} from "../middlewares/postRouter-validation-middleware";
import {authenticationGuardMiddleware} from "../middlewares/authentication-guard-middleware";
import {queryValidationMiddleware} from "../middlewares/query-validation-middleware";

import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";

import {BlogsCreateNewBlog} from "../models/BlogsCreateNewBlog";
import {BlogsUpdateBlog} from "../models/BlogsUpdateBlog";
import {QueryParams} from "../models/QueryParams";
import {BlogsCreateNewPost} from "../models/BlogCreateNewPost";
import {URIParams} from "../models/URIParams";

import {BlogType} from "../types/blogs-type";
import {PostType} from "../types/posts-type";
import {ContentPageType} from "../types/content-page-type";
import {RequestWithBody,
        RequestWithParams,
        RequestWithParamsAndBody,
        RequestWithParamsAndQuery,
        RequestWithQuery} from "../types/request-types";
import {InputParametersType} from "../types/inputParameters-type";
import {giveInputParameters} from "../inputParameters";

export const blogsRouter = Router({})

blogsRouter.post('/',
    authenticationGuardMiddleware,
    ...blogRouterValidation,
    async (req: RequestWithBody<BlogsCreateNewBlog>,
           res: Response<BlogType>) => {

        const inputParameters: InputParametersType = giveInputParameters(req)

        const newBlog = await blogsService.createNewBlog(inputParameters)

        res.status(201).send(newBlog)
    }
)

blogsRouter.post('/:id/posts',
    authenticationGuardMiddleware,
    ...postForBlogValidation,
    async (req: RequestWithParamsAndBody<URIParams, BlogsCreateNewPost>,
           res: Response<PostType>) => {

        const existsBlog = await blogsService.giveBlogById(req.params.id)

        if (!existsBlog) {
            return res.sendStatus(404)
        }

        const newPost = await postsService.createNewPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)
        res.status(201).send(newPost)
    }
)

blogsRouter.get('/',
    ...queryValidationMiddleware,
    async (req: RequestWithQuery<QueryParams>,
           res: Response<ContentPageType>) => {

    const pageWithBlogs: ContentPageType = await blogsService
        .giveBlogsPage(req.query.searchNameTerm? req.query.searchNameTerm : null,
                       req.query.sortBy,
                       req.query.sortDirection,
                       req.query.pageNumber,
                       req.query.pageSize)

    if (!pageWithBlogs) {
        return res.sendStatus(404)
    }

    res.status(200).send(pageWithBlogs)
})

blogsRouter.get('/:id',
    async (req: RequestWithParams<URIParams>,
                   res: Response<BlogType>) => {

    const blog = await blogsService.giveBlogById(req.params.id)

    if (!blog) {
        return res.sendStatus(404)
    }

    res.status(200).send(blog)
})

blogsRouter.get('/:id/posts',
    ...queryValidationMiddleware,
    async (req: RequestWithParamsAndQuery<URIParams, QueryParams>,
           res: Response<ContentPageType>) => {

    const blog: BlogType | null = await blogsService.giveBlogById(req.params.id)

    if (!blog) {
        return res.sendStatus(404)
    }

    req.query.blogId = req.params.id

    const pageWithPosts = await postsService
        .givePostsPage(req.query.sortBy,
                       req.query.sortDirection,
                       req.query.pageNumber,
                       req.query.pageSize,
                       req.query.blogId)

    res.status(200).send(pageWithPosts)
})

blogsRouter.put('/:id',
    authenticationGuardMiddleware,
    ...blogRouterValidation,
    async (req: RequestWithParamsAndBody<URIParams, BlogsUpdateBlog>,
           res: Response<BlogType | null>) => {

        const isUpdate = await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const blog = await blogsService.giveBlogById(req.params.id)
        res.status(204).send(blog)
    }
)

blogsRouter.delete('/:id',
    authenticationGuardMiddleware,
    async (req: RequestWithParams<URIParams>,
           res: Response) => {

        const isDeleted = await blogsService.deleteBlogById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        res.sendStatus(204)
    }
)