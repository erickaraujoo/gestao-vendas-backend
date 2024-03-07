import { Router } from 'express';
import { findBlingProductController } from '@main/controller';

const blingProductRouter = Router();

blingProductRouter.get('/', findBlingProductController());

export { blingProductRouter };
