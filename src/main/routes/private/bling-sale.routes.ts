import { Router } from 'express';
import { findBlingSaleController } from '@main/controller';

const blingSaleRouter = Router();

blingSaleRouter.get('/', findBlingSaleController());

export { blingSaleRouter };
