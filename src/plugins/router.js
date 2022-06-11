import aboutRoutes from '../routes/aboutController.js'
import publicRoutes from '../routes/publicController.js'
import errorRoute from '../routes/errorController.js'
import startRoute from '../routes/startController.js'
import loginRoute from '../routes/authenticationController.js'
import uploadRoute from '../routes/fileuploadController.js'
import confirmuploadController from '../routes/confirmuploadController.js'

const routes = [].concat(loginRoute).concat(
  aboutRoutes,
  publicRoutes,
  errorRoute,
  startRoute,
  uploadRoute,
  confirmuploadController
)

const router = {
  name: 'router',
  register: server => { server.route(routes) }
}
export default router
