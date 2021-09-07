import dotenv from 'dotenv'
dotenv.config()

import 'reflect-metadata'

import Koa, { Context } from 'koa'
import session from 'koa-session'
import cors from '@koa/cors'
import { createConnection } from 'typeorm'

import oauth from './oauth'
import router from './router'
import * as entities from './entities'
import { RestCode, RestResponse } from './utils'


const app = new Koa({
    keys: [process.env.KEY]
})

app.use(session({
    domain: process.env.COOKIE_DOMAIN
}, app))
app.use(oauth(app))
app.use(router.routes())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.on('error', (error, ctx: Context) => {
    console.log(error)
    ctx.body = new RestResponse(RestCode.Error, error?.toString())
});

(async () => {
    await createConnection({
        type: 'mysql',
        database: 'autopeer',
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        entities: [...Object.values(entities)],
        synchronize: true
    })
    app.listen(2333, () => {
        console.log('server started');
    })
})()
