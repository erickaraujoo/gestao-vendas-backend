import { Router } from 'express';
import { accessTokenMiddleware } from '@main/middleware';
import { authRouter, blingRouter, firebaseRouter, userRouter, userTypeRouter } from './public';
import { blingProductRouter, blingSaleRouter, tokenRouter, userDeviceTokenRouter } from './private';

const router = Router();

router.use('/api/v1/public/login', authRouter);
router.use('/api/v1/public/bling', blingRouter);
router.use('/api/v1/public/user', userRouter);
router.use('/api/v1/public/user-type', userTypeRouter);
router.use('/api/v1/public/firebase', firebaseRouter);

router.use(accessTokenMiddleware());

router.use('/api/v1/token', tokenRouter);
router.use('/api/v1/bling-product', blingProductRouter);
router.use('/api/v1/bling-sale', blingSaleRouter);
router.use('/api/v1/user-device-token', userDeviceTokenRouter);

export default router;
