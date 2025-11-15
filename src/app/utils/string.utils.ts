/**
 * Utilitaires pour la manipulation de chaînes de caractères
 */

/**
 * Génère une chaîne aléatoire
 * @param length - Longueur de la chaîne (défaut: 10)
 * @returns Chaîne aléatoire
 */
export function randomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Capitalise la première lettre d'une chaîne
 * @param str - La chaîne à capitaliser
 * @returns Chaîne capitalisée (ex: "hello" => "Hello")
 */
export function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convertit une chaîne en camelCase
 * @param str - La chaîne à convertir
 * @returns Chaîne en camelCase (ex: "Hello world" => "helloWorld")
 */
export function toCamelCase(str: string): string {
    return str.toLowerCase().replaceAll(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

/**
 * Convertit une chaîne en kebab-case
 * @param str - La chaîne à convertir
 * @returns Chaîne en kebab-case (ex: "Hello world" => "hello-world")
 */
export function toKebabCase(str: string): string {
    return str
        .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
        .replaceAll(/[\s_]+/g, '-')
        .toLowerCase();
}

/**
 * Convertit une chaîne en snake_case
 * @param str - La chaîne à convertir
 * @returns Chaîne en snake_case (ex: "Hello world" => "hello_world")
 */
export function toSnakeCase(str: string): string {
    return str
        .replaceAll(/([a-z])([A-Z])/g, '$1_$2')
        .replaceAll(/[\s-]+/g, '_')
        .toLowerCase();
}

/**
 * Tronque une chaîne à une longueur maximale
 * @param str - La chaîne à tronquer
 * @param maxLength - Longueur maximale
 * @param suffix - Suffixe à ajouter (défaut: '...')
 * @returns Chaîne tronquée
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Supprime les accents d'une chaîne
 * @param str - La chaîne
 * @returns Chaîne sans accents (ex : "évènement" => "evenement")
 */
export function removeAccents(str: string): string {
    return str.normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '');
}

/**
 * Vérifie si une chaîne est vide ou ne contient que des espaces
 * @param str - La chaîne à vérifier
 * @returns true si vide
 */
export function isBlank(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
}

/**
 * Compte le nombre d'occurrences d'une sous-chaîne
 * @param str - La chaîne principale
 * @param search - La sous-chaîne à chercher
 * @returns Nombre d'occurrences
 */
export function count(str: string, search: string): number {
    if (!search) return 0;
    return (new RegExp(search, 'g').exec(str) || []).length;
}

/**
 * Inverse une chaîne
 * @param str - La chaîne à inverser
 * @returns Chaîne inversée
 */
export function reverse(str: string): string {
    return str.split('').reverse().join('');
}
