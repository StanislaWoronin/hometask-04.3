import {Response, Router} from "express";

import {postRouterValidation} from "../middlewares/postRouter-validation-middleware";
import {authenticationGuardMiddleware} from "../middlewares/authentication-guard-middleware";
import {queryValidationMiddleware} from "../middlewares/query-validation-middleware";

import {postsService} from "../domain/posts-service";

import {QueryParams} from "../models/QueryParams";
import {PostsCreateNewPost} from "../models/PostsCreateNewPost";
import {PostsUpdatePost} from "../models/PostsUpdatePost";
import {URIParams} from "../models/URIParams";

import {PostType} from "../types/posts-type";
import {ContentPageType} from "../types/content-page-type";
import {RequestWithBody,
        RequestWithParams,
        RequestWithParamsAndBody,
        RequestWithQuery} from "../types/request-types";

export const postsRouter = Router({})

postsRouter.post('/',
    authenticationGuardMiddleware,
    ...postRouterValidation,
    async (req: RequestWithBody<PostsCreateNewPost>,
           res: Response<PostType>) => {

        const newPost = await postsService.createNewPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        if (!newPost) {
            return res.sendStatus(404)
        }

        res.status(201).send(newPost)
    }
)

postsRouter.get('/',
    ...queryValidationMiddleware,
    async (req: RequestWithQuery<QueryParams>,
           res: Response<ContentPageType>) => {

    const pageWithPosts: ContentPageType = await postsService
        .givePostsPage(req.query.sortBy,
                       req.query.sortDirection,
                       req.query.pageNumber,
                       req.query.pageSize,
                       req.query.blogId)

    if (!pageWithPosts) {
        return res.sendStatus(404)
    }

    res.status(200).send(pageWithPosts)
})

postsRouter.get('/:id',
    async (req: RequestWithParams<URIParams>,
                   res: Response<PostType>) => {

    const post = await postsService.givePostById(req.params.id)

    if (!post) {
        return res.sendStatus(404)
    }

    res.status(200).send(post)
})

postsRouter.put('/:id',
    authenticationGuardMiddleware,
    ...postRouterValidation,
    async (req: RequestWithParamsAndBody<URIParams, PostsUpdatePost>,
           res: Response<PostType | null>) => {

        const isUpdate = await postsService
            .updatePost(req.params.id,
                        req.body.title,
                        req.body.shortDescription,
                        req.body.content,
                        req.body.blogId)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const post = await postsService.givePostById(req.params.id)
        res.status(204).send(post)
    }
)

postsRouter.delete('/:id',
    authenticationGuardMiddleware,
    async (req: RequestWithParams<URIParams>,
           res: Response) => {

        const isDeleted = await postsService.deletePostById(req.params.id)

        if (isDeleted) {
            return res.sendStatus(204)
        }

        res.sendStatus(404)
    }
)