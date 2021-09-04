import Router from '@koa/router'
import jwt from 'jsonwebtoken'
import { checkFields, getASNEmail, RestCode, RestResponse, sendVerifyEmail } from '../utils'
import { User, Peer, Server } from '../entities'

declare module 'koa' {
    interface BaseContext {
        user: User
    }
}

const router = new Router()

router.use(async (ctx, next) => {
    const profile = ctx.session.grant?.response?.profile
    if (!profile?.login) {
        ctx.body = new RestResponse(RestCode.NotAuthorized, null)
        return
    }
    let user = await User.findOne({ githubId: profile.id })
    if (!user) {
        user = new User()
        user.githubId = profile.id
        user.name = profile.login
        user.email = profile.email
        user.avatarUrl = profile.avatar_url
        await user.save()
    }
    ctx.user = user
    next()
})

router.get('/peer', async ctx => {
    ctx.body = new RestResponse(RestCode.Ok, null, ctx.user.peers)
})

router.post('/peer', async ctx => {
    const query = ctx.query as Record<string, string>
    let port: number
    if (!checkFields(query, ['server', 'address', 'port', 'asn', 'v4', 'linkLocal']) || !(port = parseInt(query.port))) {
        ctx.body = new RestResponse(RestCode.Error, 'Invalid params')
        return
    }
    const server = await Server.findOne({ name: query.server })
    if (!server) {
        ctx.body = new RestResponse(RestCode.Error, 'Unknown server')
        return
    }
    const asnEmail = await getASNEmail(query.asn)
    let email: string
    if(query.token) {
        const payload = jwt.verify(query.token as string, process.env.KEY) as Record<string, string>
        email = payload.email
    } else {
        email = ctx.user.email
    }
    let payload: Record<string, string>
    if (email !== asnEmail) {
        ctx.body = new RestResponse(RestCode.Error, 'Not verified asn')
        return
    }
    const peer = new Peer()
    peer.user = ctx.user
    peer.server = server
    peer.peerAddress = query.address
    peer.peerPort = port
    peer.peerASN = query.asn
    peer.peerLinkLocal = query.linkLocal
    await peer.save()
    ctx.body = new RestResponse(RestCode.Ok, null)
})

router.delete('/peer', async ctx => {
    const id = parseInt(ctx.query.id as string)
    if (!id) {
        ctx.body = new RestResponse(RestCode.Error, 'Invalid params')
        return
    }
    const peer = ctx.user.peers.find(peer => peer.id === id)
    await peer.remove()
    ctx.body = new RestResponse(RestCode.Ok, null)
})

router.post('/verify', async ctx => {
    if (!ctx.query.email) {
        ctx.body = new RestResponse(RestCode.Error, 'Email is needed')
        return
    }
    sendVerifyEmail(ctx.query.email as string, jwt.sign({
        email: ctx.query.email
    }, process.env.KEY))
})

export default router