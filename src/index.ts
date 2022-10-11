import express from 'express'
import {testingRouter} from "./routers/testing-router";
import {blogsRouter} from "./routers/blogs-router"
import {postsRouter} from "./routers/posts-router"
import {runDb} from "./repositories/db";

export const app = express()

const port = process.env.PORT || 5000

app.use(express.json()) // add body-parser

app.use('/testing', testingRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {

        console.log(`Example app listening on port ${port}`)
    })
}

startApp()