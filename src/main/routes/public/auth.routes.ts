import { Router } from 'express';
import { loginController } from '@main/controller';

const authRouter = Router();

authRouter.post('/', loginController());

export { authRouter };
