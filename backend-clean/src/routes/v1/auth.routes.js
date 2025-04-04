import express from 'express'
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
} from '../../controllers/v1/auth.controller.js'
import { requireSession } from '../../middlewares/session.middleware.js'
import {
  registerRateLimiter,
  loginRateLimiter,
  forgotPasswordRateLimiter,
} from '../../middlewares/rateLimit.middleware.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification, session et gestion du profil utilisateur connecté
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d’un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               address: { type: string }
 *               address2: { type: string }
 *               zipCode: { type: string }
 *               city: { type: string }
 *               country: { type: string }
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post('/register', registerRateLimiter, register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d’un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Identifiants invalides
 */
router.post('/login', loginRateLimiter, login)

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion de l’utilisateur
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Déconnecté avec succès
 */
router.post('/logout', requireSession, logout)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Récupère les informations de l’utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Données utilisateur renvoyées
 *       401:
 *         description: Utilisateur non connecté
 */
router.get('/me', requireSession, getMe)

/**
 * @swagger
 * /auth/profile:
 *   patch:
 *     summary: Met à jour les informations de profil de l’utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address: { type: string }
 *               address2: { type: string }
 *               zipCode: { type: string }
 *               city: { type: string }
 *               country: { type: string }
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non autorisé
 */
router.patch('/profile', requireSession, updateProfile)

/**
 * @swagger
 * /auth/password:
 *   patch:
 *     summary: Change le mot de passe de l’utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour
 *       400:
 *         description: Mot de passe actuel incorrect
 *       401:
 *         description: Non autorisé
 */
router.patch('/password', requireSession, changePassword)

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Envoie un email de réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Email envoyé
 */
router.post('/forgot-password', forgotPasswordRateLimiter, forgotPassword)

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Réinitialise le mot de passe à l’aide d’un token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou expiré
 */
router.post('/reset-password', resetPassword)

export default router
