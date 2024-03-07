import { Router } from 'express';
import { findOneUserAccessTokenByUserController, insertUserController } from '@main/controller';

const userRouter = Router();

userRouter.get('/:ID/token', findOneUserAccessTokenByUserController());
userRouter.post('/', insertUserController());

export { userRouter };
