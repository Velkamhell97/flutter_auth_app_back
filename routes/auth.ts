import { Router } from 'express';

import { appleCallbackController, appleSigninController, googleSigninController } from '../controllers/auth';
import { appleSigninMiddlewares, googleSigninMiddlewares } from '../middlewares/auth';

const router = Router();

router.post('/google-signin', googleSigninMiddlewares, googleSigninController);

router.post('/apple-callback', appleCallbackController);
router.post('/apple-signin', appleSigninMiddlewares, appleSigninController);

export default router;