import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

/**
 * Hash un mot de passe avec Argon2
 * @param {string} password - Mot de passe brut
 * @returns {Promise<string>}
 */
export const hashPassword = (password) => argon2.hash(password)

/**
 * Vérifie si le mot de passe correspond au hash
 * @param {string} password - Mot de passe brut
 * @param {string} hash - Hash Argon2
 * @returns {Promise<boolean>}
 */
export const verifyPassword = (password, hash) => argon2.verify(hash, password)

/**
 * Génère un token JWT
 * @param {object} payload - Données à inclure dans le token
 * @param {string} [expiresIn='1h']
 * @returns {string}
 */
export const generateToken = (payload, expiresIn = '1h') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
