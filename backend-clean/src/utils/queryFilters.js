/**
 * 📅 Génère un filtre de date pour Prisma
 * @param {string} since - Date minimale (ISO ou timestamp)
 * @param {string} until - Date maximale (ISO ou timestamp)
 * @param {string} [field='timestamp'] - Champ de date à filtrer
 * @returns {object} Clause Prisma
 */
export function buildDateFilters(since, until, field = 'timestamp') {
    if (!since && !until) return {}
  
    const range = {}
    if (since) range.gte = new Date(since)
    if (until) range.lte = new Date(until)
  
    return {
      [field]: range,
    }
  }
  
/**
 * 🔍 Génère un `where` Prisma à partir de paramètres de filtrage
 * @param {object} options - Filtres à appliquer
 * @param {string} [options.userId] - ID utilisateur
 * @param {string} [options.ip] - IP à filtrer
 * @param {string} [options.since] - Date min
 * @param {string} [options.until] - Date max
 * @param {string} [options.dateField='timestamp'] - Champ date à utiliser
 * @returns {object} Clause `where`
 */
export function buildWhereClause({ userId, ip, since, until, dateField = 'timestamp' }) {
    return {
        ...(userId && { userId }),
        ...(ip && { ip }),
        ...buildDateFilters(since, until, dateField),
    }
}
  
/**
 * 🧰 Construit une requête Prisma complète avec `where`, `orderBy`, `pagination`
 * @param {object} params - Objet `req.query` typique d’une requête Express
 * @param {string} [dateField='timestamp'] - Champ date à utiliser dans les filtres
 * @returns {{
*   where: object,
*   orderBy?: object,
*   take?: number,
*   skip?: number
* }} Options pour une requête Prisma
*/
export function buildQueryOptions(params, dateField = 'timestamp') {
 const { userId, ip, since, until, orderBy, sort = 'desc', take, skip } = params

 const where = buildWhereClause({ userId, ip, since, until, dateField })

 const options = { where }

 if (orderBy) {
   options.orderBy = {
     [orderBy]: sort === 'asc' ? 'asc' : 'desc',
   }
 }

 const takeInt = Number.parseInt(take)
 if (!Number.isNaN(takeInt)) {
   options.take = Math.max(1, takeInt)
 }

 const skipInt = Number.parseInt(skip)
 if (!Number.isNaN(skipInt)) {
   options.skip = Math.max(0, skipInt)
 }

 return options
}
  