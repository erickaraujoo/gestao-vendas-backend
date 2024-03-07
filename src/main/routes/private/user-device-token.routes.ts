import { Router } from 'express';
import { insertUserDeviceTokenController } from '@main/controller';

const userDeviceTokenRouter = Router();

userDeviceTokenRouter.post('/', insertUserDeviceTokenController());

export { userDeviceTokenRouter };
