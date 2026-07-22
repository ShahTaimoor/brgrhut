const express = require('express');
const userController = require('../controllers/UserController');
const { isAuthorized, isAdminOrSuperAdmin, isSuperAdmin } = require('../middleware/authMiddleware');
const { authLimiter, generalLimiter } = require('../middleware/security');
const demoOnlyGuard = require('../middleware/demoOnlyGuard');
const validate = require('../middleware/validate');
const {
  signupOrLoginSchema,
  signupSchema,
  loginSchema,
  updateProfileSchema,
  updateUserRoleSchema,
  changePasswordSchema,
  updateUsernameSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('../validators/userValidators');

const router = express.Router();

router.post('/auth/signup-or-login', authLimiter, validate(signupOrLoginSchema), userController.signupOrLogin);
router.post('/signup', authLimiter, validate(signupSchema), userController.signup);
router.post('/login', authLimiter, validate(loginSchema), userController.login);
router.post('/admin/login', authLimiter, validate(loginSchema), userController.adminLogin);
// ============================================================================
// !!! DEMO MODE ONLY - SECURITY WARNING !!!
// This route grants full super-admin access with ZERO credentials to anyone
// who calls it. demoOnlyGuard blocks it unless NODE_ENV isn't "production"
// AND the request comes from a loopback/private-network address (see
// middleware/demoOnlyGuard.js) - but that guard is a safety net, not a
// substitute for deleting this. DELETE THIS ROUTE (and UserService.demoLogin
// / UserController.demoLogin / middleware/demoOnlyGuard.js / the frontend
// authService.demoLogin + authSlice.demoLogin + DemoAutoLogin.jsx) BEFORE
// this app is ever deployed anywhere real users or the public can reach it.
// ============================================================================
router.post('/demo-login', demoOnlyGuard, authLimiter, userController.demoLogin);
router.post('/refresh-token', authLimiter, userController.refreshToken);
router.get('/logout', userController.logout);
router.post('/logout', userController.logout);
router.get('/verify-token', generalLimiter, userController.verifyToken);
router.get('/all-users', isAuthorized, isAdminOrSuperAdmin, userController.getAllUsers);
router.put('/update-profile', isAuthorized, validate(updateProfileSchema), userController.updateProfile);
router.put('/update-user-role/:userId', isAuthorized, validate(updateUserRoleSchema), userController.updateUserRole);
router.put('/change-password', isAuthorized, validate(changePasswordSchema), userController.changePassword);
router.put('/update-username', isAuthorized, validate(updateUsernameSchema), userController.updateUsername);
router.delete('/users/:userId', isAuthorized, isAdminOrSuperAdmin, userController.deleteUser);

// Password reset routes
router.post('/admin/forgot-password', authLimiter, validate(forgotPasswordSchema), userController.requestPasswordReset);
router.get('/admin/password-reset-requests', isAuthorized, isSuperAdmin, userController.getPendingPasswordResetRequests);
router.put('/admin/reset-password/:requestId', isAuthorized, isSuperAdmin, validate(resetPasswordSchema), userController.resetAdminPassword);
router.get('/admin/audit-logs', isAuthorized, isSuperAdmin, userController.getAuditLogs);

module.exports = router;
