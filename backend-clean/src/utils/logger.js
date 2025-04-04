/**
 * Logger centralisé pour l’application Stark Byte Hub.
 * Ne loggue qu’en environnement de développement.
 */
export const logger = {
    /**
     * Log d’information (non critique)
     * @param  {...any} args - Données à afficher
     */
    info: (...args) => {
      if (process.env.NODE_ENV !== 'production') {
        console.info('\x1b[36m[INFO]\x1b[0m', ...args);
      }
    },
  
    /**
     * Log d’avertissement (comportement inattendu)
     * @param  {...any} args - Données à afficher
     */
    warn: (...args) => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('\x1b[33m[WARN]\x1b[0m', ...args);
      }
    },
  
    /**
     * Log d’erreur (exception, bug, plantage)
     * @param  {...any} args - Données à afficher
     */
    error: (...args) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('\x1b[31m[ERROR]\x1b[0m', ...args);
      }
    },
  };