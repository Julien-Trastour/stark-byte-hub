import auth from './auth.routes.js'
import user from './user.routes.js'
import robot from './robot.routes.js'
import news from './news.routes.js'
import log from './log.routes.js'
import role from './role.routes.js'
import permission from './permission.routes.js'
import upload from './upload.routes.js'
import download from './download.routes.js'

export default {
  auth,
  users: user,
  robots: robot,
  news,
  logs: log,
  roles: role,
  permissions: permission,
  upload,
  download,
}