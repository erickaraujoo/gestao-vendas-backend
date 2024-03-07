import { Router } from 'express';
import { loginBlingController, refreshBlingTokenController } from '@main/controller';

// TODO: Mudar para rota privada
const blingRouter = Router();

blingRouter.get('/login', loginBlingController());
blingRouter.get('/refresh-token', refreshBlingTokenController());

export { blingRouter };
