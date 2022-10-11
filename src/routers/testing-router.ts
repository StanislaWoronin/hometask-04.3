import {Request, Response, Router} from "express";

import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    try {
        await postsRepository.deleteAllPosts()
        await blogsRepository.deleteAllBlogs()
        return res.sendStatus(204)
    } catch (e) {
        console.log('testingRouter => all-data =>', e)
        return res.sendStatus(503)
    }
})