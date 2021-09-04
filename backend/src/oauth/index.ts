import Koa from 'koa'
import grant from 'grant'

export default function (app: Koa) {
    return grant.koa({
        "defaults": {
            "origin": "http://localhost:2333",
            "transport": "session",
            "state": true
        },
        "github": {
            "key": process.env.GITHUB_KEY,
            "secret": process.env.GITHUB_SECRET,
            "scope": ["read:user", "user:email"],
            "response": ["profile", "tokens"],
            // "callback": "https://peer.anillc.cn/logedin"
            "callback": "http://localhost:2333/v1/api/test"
        }
    })
}