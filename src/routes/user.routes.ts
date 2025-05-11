import { Router } from 'express';
import { authenticateUser, optionalAuth } from '../middleware/auth.middleware';
import { validateRegistration, validateProfileUpdate } from '../middleware/validation';
import {
    register,
    getProfile,
    updateProfile,
    requestPasswordReset,
    deleteAccount,
    updatePreferences,
    updateDashboardConfig
} from '../controllers/user.controller';

const router = Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/reset-password', requestPasswordReset);

// Protected routes
router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, validateProfileUpdate, updateProfile);
router.put('/preferences', authenticateUser, updatePreferences);
router.put('/dashboard-config', authenticateUser, updateDashboardConfig);
router.delete('/account', authenticateUser, deleteAccount);

export default router; 