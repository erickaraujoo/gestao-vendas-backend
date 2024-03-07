import { Router } from 'express';
import { getFirebaseTokenController, sendFirebaseMessageController } from '@main/controller';

const firebaseRouter = Router();

firebaseRouter.get('/token', getFirebaseTokenController());
firebaseRouter.get('/message/send', sendFirebaseMessageController());

export { firebaseRouter };
