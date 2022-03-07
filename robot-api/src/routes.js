import { Router } from 'express'

import RoboController from './controllers/RoboController'

const routes = Router()

routes.post('/robo', RoboController.index)

export default routes