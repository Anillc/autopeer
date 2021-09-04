import Router from '@koa/router'
import { Server } from '../entities'
import { checkFields, RestCode, RestResponse } from '../utils'

const router = new Router()

router.use((ctx, next) => {
    if (!ctx.query.passwd || ctx.query.passwd !== process.env.PASSWD) {
        ctx.body = new RestResponse(RestCode.NotAuthorized, null)
        return
    }
    next()
})

router.post('/register', async ctx => {
    if (!checkFields(ctx.query, ['name', 'description', 'publicKey', 'dn42v4', 'linkLocal', 'asn'])) {
        ctx.body = new RestResponse(RestCode.Error, 'Invalid params')
        return
    }
    let server = await Server.findOne({ name: ctx.query.name as string })
    if (!server) {
        server = new Server()
    }
    Object.assign(server, ctx.query)
    server.updatedAt = new Date()
    await server.save()
    ctx.body = new RestResponse(RestCode.Ok, null, server)
})

router.get('/peerinfo', async ctx => {
    if (!ctx.query.id) {
        ctx.body = new RestResponse(RestCode.Error, 'No id passed')
        return
    }
    let server = await Server.findOne(ctx.query.id as string)
    if (!server) {
        ctx.body = new RestResponse(RestCode.Error, 'Unregistered server')
        return
    }
    ctx.body = new RestResponse(RestCode.Ok, null, server.peers)
})

export default router