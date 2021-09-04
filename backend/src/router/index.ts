import Router from '@koa/router'
import apis from './api'
import brouter from './brouter'

const router = new Router()

router.use('/v1/api', apis.routes())
router.use('/v1/brouter', brouter.routes())

export default router