/**
 * Utilitaires pour la manipulation d'heures
 */

// Formats d'heure courants
export const TimeFormats = {
    H: 'HH',
    H_M: 'HH:MM',
    H_M_S: 'HH:MM:SS',
    HM: 'HHMM',
    HMS: 'HHMMSS',
} as const;

/**
 * Retourne l'heure actuelle en secondes depuis minuit
 */
export function now(): number {
    const date = new Date();
    return date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
}

/**
 * Vérifie si une chaîne est une heure valide
 * @param timeStr - Chaîne d'heure (ex: '14:30', '14:30:00', '1430')
 * @returns true si valide
 */
export function isValidTime(timeStr: string): boolean {
    const regexp = /^([0-1]\d|2[0-3])((:)?[0-5]\d)?((:)?[0-5]\d)?$/;
    return regexp.test(timeStr);
}

/**
 * Convertit un temps en secondes vers une chaîne formatée
 * @param timeInSeconds - Temps en secondes depuis minuit
 * @param timeFormat - Format de sortie (ex: 'HH:MM:SS')
 * @returns Chaîne formatée
 */
export function timeToText(timeInSeconds: number, timeFormat: string): string {
    const hours = Math.floor(timeInSeconds / 60 / 60);
    const minutes = Math.floor((timeInSeconds - hours * 60 * 60) / 60);
    const seconds = timeInSeconds - hours * 60 * 60 - minutes * 60;

    return timeFormat
        .replace('HH', hours.toString().padStart(2, '0'))
        .replace('MM', minutes.toString().padStart(2, '0'))
        .replace('SS', seconds.toString().padStart(2, '0'));
}

/**
 * Convertit une chaîne d'heure en secondes depuis minuit
 * @param timeStr - Chaîne d'heure (ex: '14:30', '14:30:00')
 * @returns Temps en secondes
 */
export function textToTime(timeStr: string): number {
    if (!isValidTime(timeStr)) return 0;
    return 60 * 60 * getHours(timeStr) + 60 * getMinutes(timeStr) + getSeconds(timeStr);
}

/**
 * Extrait les heures d'une chaîne d'heure
 * @param timeStr - Chaîne d'heure
 * @returns Heures (0-23)
 */
export function getHours(timeStr: string): number {
    if (!isValidTime(timeStr)) return 0;
    const timeFormat = getTimeFormat(timeStr);
    const index = timeFormat.indexOf('HH');
    return Number.parseInt(timeStr.substring(index, index + 2));
}

/**
 * Extrait les minutes d'une chaîne d'heure
 * @param timeStr - Chaîne d'heure
 * @returns Minutes (0-59)
 */
export function getMinutes(timeStr: string): number {
    if (!isValidTime(timeStr)) return 0;
    const timeFormat = getTimeFormat(timeStr);
    if (!timeFormat.includes('MM')) return 0;
    const index = timeFormat.indexOf('MM');
    return Number.parseInt(timeStr.substring(index, index + 2));
}

/**
 * Extrait les secondes d'une chaîne d'heure
 * @param timeStr - Chaîne d'heure
 * @returns Secondes (0-59)
 */
export function getSeconds(timeStr: string): number {
    if (!isValidTime(timeStr)) return 0;
    const timeFormat = getTimeFormat(timeStr);
    if (!timeFormat.includes('SS')) return 0;
    const index = timeFormat.indexOf('SS');
    return Number.parseInt(timeStr.substring(index, index + 2));
}

/**
 * Vérifie si l'heure A est avant l'heure B
 * @param timeA - Première heure
 * @param timeB - Deuxième heure
 * @returns true si timeA < timeB
 */
export function timeBefore(timeA: string, timeB: string): boolean {
    return textToTime(timeA) < textToTime(timeB);
}

/**
 * Vérifie si l'heure A est après l'heure B
 * @param timeA - Première heure
 * @param timeB - Deuxième heure
 * @returns true si timeA > timeB
 */
export function timeAfter(timeA: string, timeB: string): boolean {
    return textToTime(timeA) > textToTime(timeB);
}

/**
 * Vérifie si deux heures sont égales
 * @param timeA - Première heure
 * @param timeB - Deuxième heure
 * @returns true si égales
 */
export function timeEqual(timeA: string, timeB: string): boolean {
    return textToTime(timeA) === textToTime(timeB);
}

/**
 * Formate une heure d'un format à un autre
 * @param timeStr - Chaîne d'heure
 * @param outputFormat - Format de sortie
 * @returns Heure formatée
 */
export function formatTime(timeStr: string, outputFormat: string): string {
    return timeToText(textToTime(timeStr), outputFormat);
}

/**
 * Détecte le format d'une chaîne d'heure
 * @param timeStr - Chaîne d'heure
 * @returns Format détecté ou chaîne vide
 */
export function getTimeFormat(timeStr: string): string {
    const patterns: Record<string, string> = {
        [TimeFormats.H_M_S]: String.raw`^([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$`,
        [TimeFormats.HMS]: String.raw`^([0-1]\d|2[0-3])[0-5]\d[0-5]\d$`,
        [TimeFormats.H_M]: String.raw`^([0-1]\d|2[0-3]):[0-5]\d$`,
        [TimeFormats.HM]: String.raw`^([0-1]\d|2[0-3])[0-5]\d$`,
        [TimeFormats.H]: String.raw`^([0-1]\d|2[0-3])$`,
    };

    for (const [timeFormat, pattern] of Object.entries(patterns)) {
        if (new RegExp(pattern).test(timeStr)) {
            return timeFormat;
        }
    }

    return '';
}

/**
 * Ajoute des heures à un temps
 * @param timeStr - Heure de départ
 * @param hours - Nombre d'heures à ajouter
 * @param timeFormat - Format de sortie
 * @returns Nouvelle heure formatée
 */
export function addHours(timeStr: string, hours: number, timeFormat: string = TimeFormats.H_M): string {
    let seconds = textToTime(timeStr);
    seconds += hours * 60 * 60;
    // Gérer le débordement (plus de 24h)
    seconds = seconds % (24 * 60 * 60);
    if (seconds < 0) seconds += 24 * 60 * 60;
    return timeToText(seconds, timeFormat);
}

/**
 * Ajoute des minutes à un temps
 * @param timeStr - Heure de départ
 * @param minutes - Nombre de minutes à ajouter
 * @param timeFormat - Format de sortie
 * @returns Nouvelle heure formatée
 */
export function addMinutes(timeStr: string, minutes: number, timeFormat: string = TimeFormats.H_M): string {
    let seconds = textToTime(timeStr);
    seconds += minutes * 60;
    // Gérer le débordement
    seconds = seconds % (24 * 60 * 60);
    if (seconds < 0) seconds += 24 * 60 * 60;
    return timeToText(seconds, timeFormat);
}

/**
 * Calcule la différence en minutes entre deux heures
 * @param timeA - Première heure
 * @param timeB - Deuxième heure
 * @returns Différence en minutes
 */
export function diffInMinutes(timeA: string, timeB: string): number {
    const secondsA = textToTime(timeA);
    const secondsB = textToTime(timeB);
    return Math.floor(Math.abs(secondsA - secondsB) / 60);
}
