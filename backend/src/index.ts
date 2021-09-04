import dotenv from 'dotenv'
import 'reflect-metadata'

import Koa, { Context } from 'koa'
import session from 'koa-session'
import cors from '@koa/cors'
import { createConnection } from 'typeorm'

import oauth from './oauth'
import router from './router'
import * as entities from './entities'
import { RestCode, RestResponse } from './utils'

dotenv.config()

const app = new Koa({
    keys: [process.env.KEY]
})

app.use(session(app))
app.use(oauth(app))
app.use(router.routes())
app.use(cors({
    origin: 'https://peer.anillc.cn',
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
