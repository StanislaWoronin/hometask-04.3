import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";
import {PostType} from "../types/posts-type";
import {ContentPageType} from "../types/content-page-type";

import {paginationContentPage} from "../paginationContentPage";

export const postsService = {
    async createNewPost(title: string,
                        shortDescription: string,
                        content: string,
                        id: string): Promise<PostType> {

        const newPost: PostType = {
            id: String(+new Date()),
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: id,
            blogName: await blogsRepository.giveBlogName(id),
            createdAt: new Date().toISOString()
        }

        await postsRepository.createNewPost({...newPost})
        return newPost
    },

    async givePostsPage(sortBy: string,
                        sortDirection: 'asc' | 'desc',
                        pageNumber: string,
                        pageSize: string,
                        blogId: string) : Promise<ContentPageType> {

        const content = await postsRepository.givePosts(sortBy, sortDirection, pageNumber, pageSize, blogId)
        const totalCount = await postsRepository.giveTotalCount(blogId)

        return paginationContentPage(pageNumber, pageSize, content, totalCount)
    },

    async givePostById(id: string): Promise<PostType | null> {
        return await postsRepository.givePostById(id)
    },

    async updatePost(id: string,
                     title: string,
                     shortDescription: string,
                     content: string,
                     blogId: string): Promise<boolean> {

        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },

    async deletePostById(id: string): Promise<boolean> {
        return await postsRepository.deletePostById(id)
    },
}