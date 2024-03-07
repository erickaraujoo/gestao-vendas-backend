import { Router } from 'express';
import { refreshTokenController } from '@main/controller';

const tokenRouter = Router();

tokenRouter.post('/refresh-token', refreshTokenController());

export { tokenRouter };
