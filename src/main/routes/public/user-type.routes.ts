import { Router } from 'express';
import { findUserTypeController } from '@main/controller';

const userTypeRouter = Router();

userTypeRouter.get('/', findUserTypeController());

export { userTypeRouter };
