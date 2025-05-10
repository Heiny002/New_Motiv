import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticateUser } from '../middleware/auth';
import { validateRegistration, validateProfileUpdate } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/auth/register', validateRegistration, UserController.register);
router.post('/auth/reset-password', UserController.requestPasswordReset);

// Protected routes
router.get('/users/profile', authenticateUser, UserController.getProfile);
router.put('/users/profile', authenticateUser, validateProfileUpdate, UserController.updateProfile);
router.delete('/users/profile', authenticateUser, UserController.deleteAccount);

export default router; 