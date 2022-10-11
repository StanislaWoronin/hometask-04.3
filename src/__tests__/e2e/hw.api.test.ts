import request from 'supertest'
import {app} from "../../index";
import any = jasmine.any;

describe('/posts', () => {
    beforeAll(async  () => {
        await  request(app).delete('/testing/all-data')
    })

    it('Expected 401 - unauthorized', async  () => {
        await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .expect(401)
    })

    it('Expected 400 - bad request', async () => {
        await request(app)
            .post('/blogs')
            .send({
                "name": "",
                "youtubeUrl": ""
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(400)
    })

    it('Expected 201 - return new blog', async () => {
        const createResponse = await request(app)
            .post('/blogs')
            .send({
                "name": "new blog",
                "youtubeUrl": "https://someurl.com"
            })
            .set({Authorization: 'Basic YWRtaW46cXdlcnR5'})
            .expect(201)

       const createdBlogs = createResponse.body

       expect(createdBlogs).toEqual({
           id: expect.any(String),
           name: 'new blog',
           youtubeUrl: expect.stringMatching(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/),
           createdAt: expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)
       })
    })
})