/**
 * Utilitaires pour la manipulation de dates
 * Sans dépendances externes - utilise uniquement les API natives JavaScript
 */

// Formats de date courants
export const DateFormats = {
    D_M_Y: 'dd/MM/yyyy',
    M_D_Y: 'MM/dd/yyyy',
    Y_M_D: 'yyyy/MM/dd',
    Y_D_M: 'yyyy/dd/MM',
    DMY: 'ddMMyyyy',
    MDY: 'MMddyyyy',
    YMD: 'yyyyMMdd',
    YDM: 'yyyyddMM',
    M_Y: 'MM/yyyy',
    Y_M: 'yyyy/MM',
    MY: 'MMyyyy',
    YM: 'yyyyMM',
} as const;

// Jours de la semaine
export const Days = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
} as const;

// Noms des jours
export const DayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Mois
export const Months = {
    JANUARY: 0,
    FEBRUARY: 1,
    MARCH: 2,
    APRIL: 3,
    MAY: 4,
    JUNE: 5,
    JULY: 6,
    AUGUST: 7,
    SEPTEMBER: 8,
    OCTOBER: 9,
    NOVEMBER: 10,
    DECEMBER: 11,
} as const;

// Noms des mois
export const MonthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
];

/**
 * Retourne la date d'aujourd'hui
 * @returns Date d'aujourd'hui
 */
export function today(): Date {
    return new Date();
}

/**
 * Copie une date
 * @param date - Date à copier
 * @returns Copie de la date
 */
export function copyDate(date: Date): Date {
    return new Date(date);
}

/**
 * Ajoute des jours à une date
 * @param date - Date de référence
 * @param days - Nombre de jours à ajouter
 * @returns Nouvelle date avec les jours ajoutés
 */
export function addDays(date: Date, days: number): Date {
    const result = copyDate(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Retourne la date d'hier
 * @returns Date d'hier
 */
export function yesterday(): Date {
    return addDays(today(), -1);
}

/**
 * Retourne la date de demain
 * @returns Date de demain
 */
export function tomorrow(): Date {
    return addDays(today(), 1);
}

/**
 * Retourne le début de la journée (00:00:00)
 * @param date - Date de référence
 * @returns Date du début de la journée
 */
export function startOfDay(date: Date): Date {
    const result = copyDate(date);
    result.setHours(0, 0, 0, 0);
    return result;
}

/**
 * Retourne la fin de la journée (23:59:59.999)
 * @param date - Date de référence
 * @returns Date de la fin de la journée
 */
export function endOfDay(date: Date): Date {
    const result = copyDate(date);
    result.setHours(23, 59, 59, 999);
    return result;
}

/**
 * Retourne le premier jour du mois
 * @param date - Date de référence
 * @returns Date du premier jour du mois
 */
export function firstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Retourne le dernier jour du mois
 * @param date - Date de référence
 * @returns Date du dernier jour du mois
 */
export function lastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Ajoute des semaines à une date
 * @param date - Date de référence
 * @param weeks - Nombre de semaines à ajouter
 * @returns Nouvelle date avec les semaines ajoutées
 */
export function addWeeks(date: Date, weeks: number): Date {
    return addDays(date, weeks * 7);
}

/**
 * Ajoute des mois à une date
 * @param date - Date de référence
 * @param months - Nombre de mois à ajouter
 * @returns Nouvelle date avec les mois ajoutés
 */
export function addMonths(date: Date, months: number): Date {
    const result = copyDate(date);
    const day = result.getDate();
    result.setMonth(result.getMonth() + months);

    // Si le jour a changé (par ex: 31 janvier + 1 mois = 3 mars au lieu de fin février)
    // on revient au dernier jour du mois précédent
    if (result.getDate() !== day) {
        result.setDate(0);
    }

    return result;
}

/**
 * Ajoute des années à une date
 * @param date - Date de référence
 * @param years - Nombre d'années à ajouter
 * @returns Nouvelle date avec les années ajoutées
 */
export function addYears(date: Date, years: number): Date {
    const result = copyDate(date);
    const day = result.getDate();
    result.setFullYear(result.getFullYear() + years);

    // Gestion du 29 février
    if (result.getDate() !== day) {
        result.setDate(0);
    }

    return result;
}

/**
 * Convertit une chaîne en Date
 * @param dateStr - Chaîne de date
 * @param dateFormat - Format de la date (ex: 'dd/MM/yyyy')
 * @returns Date ou undefined si invalide
 */
export function textToDate(dateStr: string, dateFormat: string): Date | undefined {
    if (!dateStr || !dateFormat) return undefined;

    const format = dateFormat.toUpperCase();
    const regexp = format
        .replaceAll('DD', String.raw`([0-2]\d|3[01])`)
        .replaceAll('MM', String.raw`(0\d|1[0-2])`)
        .replaceAll('YYYY', String.raw`(\d{4})`)
        .replaceAll('/', String.raw`\/`)
        .replaceAll('.', String.raw`\.`)
        .replaceAll('-', String.raw`\-`);

    const match = new RegExp(`^${regexp}$`).exec(dateStr);
    if (!match) return undefined;

    const yearIndex = format.indexOf('YYYY');
    const monthIndex = format.indexOf('MM');
    const dayIndex = format.indexOf('DD');

    // Extraire les valeurs selon leur position dans le format
    let yearStr = '';
    let monthStr = '';
    let dayStr = '01'; // Par défaut pour les formats sans jour

    if (yearIndex !== -1) {
        yearStr = dateStr.substring(yearIndex, yearIndex + 4);
    }
    if (monthIndex !== -1) {
        monthStr = dateStr.substring(monthIndex, monthIndex + 2);
    }
    if (dayIndex !== -1) {
        dayStr = dateStr.substring(dayIndex, dayIndex + 2);
    }

    const year = Number.parseInt(yearStr, 10);
    const month = Number.parseInt(monthStr, 10) - 1; // Les mois commencent à 0
    const day = Number.parseInt(dayStr, 10);

    const date = new Date(year, month, day);

    // Vérifier que la date est valide (par ex: 31 février n'existe pas)
    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        return undefined;
    }

    return date;
}

/**
 * Convertit une Date en chaîne
 * @param date - Date à convertir
 * @param dateFormat - Format de sortie (ex: 'dd/MM/yyyy')
 * @returns Chaîne formatée
 */
export function dateToText(date: Date, dateFormat: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return dateFormat
        .replace('dd', day)
        .replace('DD', day)
        .replace('MM', month)
        .replace('yyyy', year)
        .replace('YYYY', year);
}

/**
 * Convertit une date en texte complet (ex: "Lundi 15 novembre 2025")
 * @param date - Date ou chaîne de date
 * @param dateFormat - Format de la date si c'est une chaîne
 * @returns Texte complet
 */
export function dateToFullText(date: Date | string, dateFormat?: string): string {
    const dateObj = typeof date === 'string' && dateFormat ? textToDate(date, dateFormat) : (date as Date);
    if (!dateObj) return '';

    const dayName = DayNames[dateObj.getDay()];
    const day = dateObj.getDate();
    const monthName = MonthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    return `${dayName} ${day} ${monthName} ${year}`;
}

/**
 * Vérifie si une chaîne est une date valide
 * @param dateStr - Chaîne à vérifier
 * @param dateFormat - Format attendu
 * @returns true si valide
 */
export function isValidDate(dateStr: string, dateFormat: string): boolean {
    const date = textToDate(dateStr, dateFormat);
    return date !== undefined && dateToText(date, dateFormat) === dateStr;
}

/**
 * Retourne le prochain jour de la semaine spécifié
 * @param date - Date de référence
 * @param dayOfWeek - Jour de la semaine (0-6, 0=Dimanche)
 * @returns Date du prochain jour spécifié
 */
export function nextWeekday(date: Date, dayOfWeek: number): Date {
    const result = copyDate(date);
    const currentDay = date.getDay();

    if (currentDay < dayOfWeek) {
        result.setDate(date.getDate() + (dayOfWeek - currentDay));
    } else {
        result.setDate(date.getDate() + (7 - (currentDay - dayOfWeek)));
    }

    return result;
}

/**
 * Vérifie si la date A est avant la date B
 * @param dateA - Première date
 * @param dateB - Deuxième date
 * @param dateFormat - Format de date si les dates sont des chaînes
 * @returns true si avant
 */
export function dateBefore(dateA: Date | string, dateB: Date | string, dateFormat?: string): boolean {
    const a = typeof dateA === 'string' && dateFormat ? textToDate(dateA, dateFormat) : (dateA as Date);
    const b = typeof dateB === 'string' && dateFormat ? textToDate(dateB, dateFormat) : (dateB as Date);
    if (!a || !b) return false;
    return startOfDay(a).getTime() < startOfDay(b).getTime();
}

/**
 * Vérifie si la date A est après la date B
 * @param dateA - Première date
 * @param dateB - Deuxième date
 * @param dateFormat - Format de date si les dates sont des chaînes
 * @returns true si après
 */
export function dateAfter(dateA: Date | string, dateB: Date | string, dateFormat?: string): boolean {
    const a = typeof dateA === 'string' && dateFormat ? textToDate(dateA, dateFormat) : (dateA as Date);
    const b = typeof dateB === 'string' && dateFormat ? textToDate(dateB, dateFormat) : (dateB as Date);
    if (!a || !b) return false;
    return startOfDay(a).getTime() > startOfDay(b).getTime();
}

/**
 * Vérifie si deux dates sont égales (jour)
 * @param dateA - Première date
 * @param dateB - Deuxième date
 * @param dateFormat - Format de date si les dates sont des chaînes
 * @returns true si égales
 */
export function dateEquals(dateA: Date | string, dateB: Date | string, dateFormat?: string): boolean {
    const a = typeof dateA === 'string' && dateFormat ? textToDate(dateA, dateFormat) : (dateA as Date);
    const b = typeof dateB === 'string' && dateFormat ? textToDate(dateB, dateFormat) : (dateB as Date);
    if (!a || !b) return false;
    return startOfDay(a).getTime() === startOfDay(b).getTime();
}

/**
 * Formate une date d'un format à un autre
 * @param dateStr - Chaîne de date
 * @param inputFormat - Format d'entrée
 * @param outputFormat - Format de sortie
 * @returns Date formatée
 */
export function formatDate(dateStr: string, inputFormat: string, outputFormat: string): string | undefined {
    const date = textToDate(dateStr, inputFormat);
    return date ? dateToText(date, outputFormat) : undefined;
}

/**
 * Calcule le nombre de jours entre deux dates
 * @param dateA - Première date
 * @param dateB - Deuxième date
 * @returns Nombre de jours entre les deux dates
 */
export function daysBetween(dateA: Date, dateB: Date): number {
    const a = startOfDay(dateA);
    const b = startOfDay(dateB);
    const diffTime = Math.abs(b.getTime() - a.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calcule le nombre de mois entre deux dates
 * @param dateA - Première date
 * @param dateB - Deuxième date
 * @returns Nombre de mois entre les deux dates
 */
export function monthsBetween(dateA: Date, dateB: Date): number {
    const yearDiff = dateB.getFullYear() - dateA.getFullYear();
    const monthDiff = dateB.getMonth() - dateA.getMonth();
    return Math.abs(yearDiff * 12 + monthDiff);
}

/**
 * Calcule le nombre d'années entre deux dates
 * @param dateA - Première date
 * @param dateB - Deuxième date
 * @returns Nombre d'années entre les deux dates
 */
export function yearsBetween(dateA: Date, dateB: Date): number {
    return Math.abs(dateB.getFullYear() - dateA.getFullYear());
}

/**
 * Vérifie si une année est bissextile
 * @param year - Année à vérifier
 * @returns true si bissextile
 */
export function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Retourne le nombre de jours dans un mois
 * @param date - Date de référence
 * @returns Nombre de jours dans le mois
 */
export function daysInMonth(date: Date): number {
    return lastDayOfMonth(date).getDate();
}

/**
 * Vérifie si une date est aujourd'hui
 * @param date - Date à vérifier
 * @returns true si aujourd'hui
 */
export function isToday(date: Date): boolean {
    return dateEquals(date, today());
}

/**
 * Vérifie si une date est dans le passé
 * @param date - Date à vérifier
 * @returns true si dans le passé
 */
export function isPast(date: Date): boolean {
    return dateBefore(date, today());
}

/**
 * Vérifie si une date est dans le futur
 * @param date - Date à vérifier
 * @returns true si dans le futur
 */
export function isFuture(date: Date): boolean {
    return dateAfter(date, today());
}

/**
 * Vérifie si une date est un week-end
 * @param date - Date à vérifier
 * @returns true si week-end
 */
export function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // Dimanche ou Samedi
}

/**
 * Détecte automatiquement le format d'une date
 * @param dateStr - Chaîne de date
 * @returns Format détecté ou undefined si non reconnu
 */
export function detectFormat(dateStr: string): string | undefined {
    const patterns: Record<string, RegExp> = {
        [DateFormats.D_M_Y]: /^([0-2]\d|3[01])[/\-.](0?\d|1[0-2])[/\-.](\d{4})$/,
        [DateFormats.M_D_Y]: /^(0?\d|1[0-2])[/\-.]([0-2]\d|3[01])[/\-.](\d{4})$/,
        [DateFormats.Y_M_D]: /^(\d{4})[/\-.](0?\d|1[0-2])[/\-.]([0-2]\d|3[01])$/,
        [DateFormats.DMY]: /^([0-2]\d|3[01])(0?\d|1[0-2])(\d{4})$/,
        [DateFormats.MDY]: /^(0?\d|1[0-2])([0-2]\d|3[01])(\d{4})$/,
        [DateFormats.YMD]: /^(\d{4})(0?\d|1[0-2])([0-2]\d|3[01])$/,
        [DateFormats.M_Y]: /^(0?\d|1[0-2])[/\-.](\d{4})$/,
        [DateFormats.Y_M]: /^(\d{4})[/\-.](0?\d|1[0-2])$/,
    };

    for (const [format, pattern] of Object.entries(patterns)) {
        if (pattern.test(dateStr)) {
            return format;
        }
    }

    return undefined;
}
