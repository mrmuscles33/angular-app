/**
 * Utilitaires pour la manipulation d'objets
 */

/**
 * Vérifie si deux objets sont égaux (comparaison superficielle)
 * @param objA - Premier objet
 * @param objB - Deuxième objet
 * @param whiteList - Liste de propriétés à inclure dans la comparaison
 * @param blackList - Liste de propriétés à exclure de la comparaison
 * @returns true si les objets sont égaux
 */
export function areEqual<T extends Record<string, any>>(objA: T, objB: T, whiteList: string[] = [], blackList: string[] = []): boolean {
    const filterKeys = (keys: string[]) => keys.filter((prop) => !blackList.includes(prop) && (whiteList.length === 0 || whiteList.includes(prop)));

    const keysA = filterKeys(Object.keys(objA));
    const keysB = filterKeys(Object.keys(objB));

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) => objA[key] === objB[key]);
}

/**
 * Vérifie si un objet est undefined
 * @param obj - L'objet à vérifier
 * @returns true si undefined
 */
export function isUndefined(obj: any): obj is undefined {
    return obj === undefined;
}

/**
 * Vérifie si un objet est null
 * @param obj - L'objet à vérifier
 * @returns true si null
 */
export function isNull(obj: any): obj is null {
    return obj === null;
}

/**
 * Vérifie si un objet est défini (ni null ni undefined)
 * @param obj - L'objet à vérifier
 * @returns true si défini
 */
export function isDefined<T>(obj: T | null | undefined): obj is T {
    return obj !== null && obj !== undefined;
}

/**
 * Clone profond d'un objet (via JSON)
 * Note: Ne clone pas les fonctions, Date, RegExp, etc.
 * @param obj - L'objet à cloner
 * @returns Clone de l'objet
 */
export function clone<T>(obj: T): T {
    if (!isDefined(obj)) return obj;
    return structuredClone(obj);
}

/**
 * Clone superficiel d'un objet
 * @param obj - L'objet à cloner
 * @returns Clone de l'objet
 */
export function shallowClone<T>(obj: T): T {
    if (!isDefined(obj)) return obj;
    if (Array.isArray(obj)) return [...obj] as T;
    return { ...obj };
}

/**
 * Fusionne deux objets (shallow merge)
 * @param obj1 - Premier objet
 * @param obj2 - Deuxième objet (prioritaire)
 * @returns Objet fusionné
 */
export function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

/**
 * Vérifie si une valeur est un objet
 * @param obj - La valeur à vérifier
 * @returns true si c'est un objet
 */
export function isObject(obj: any): obj is Record<string, any> {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

/**
 * Supprime les propriétés undefined/null d'un objet
 * @param obj - L'objet à nettoyer
 * @param removeNull - Supprimer les valeurs null (défaut: true)
 * @returns Objet nettoyé
 */
export function clean<T extends object>(obj: T, removeNull: boolean = true): Partial<T> {
    const result: any = {};

    for (const key of Object.keys(obj)) {
        const value = obj[key as keyof T];
        if (value !== undefined && (!removeNull || value !== null)) {
            result[key] = value;
        }
    }

    return result;
}
