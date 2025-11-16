/**
 * Utilitaires pour la manipulation de tableaux
 */

import { textToDate, dateBefore, dateAfter, dateEquals } from './date.utils';

export type SortDirection = 'asc' | 'desc';
export type FilterType = 'equals' | 'before' | 'after' | 'between' | 'contains' | 'starts' | 'ends' | 'in';

export interface ArrayFilter<T = any> {
    property: keyof T;
    type: FilterType;
    value?: any;
    min?: any;
    max?: any;
    dateType?: 'date' | 'string';
    format?: string;
}

/**
 * Trie un tableau par une propriété donnée
 * @param array - Le tableau à trier
 * @param property - La propriété sur laquelle trier (optionnel pour tableaux primitifs)
 * @param direction - Direction du tri ('asc' ou 'desc')
 * @param dateFormat - Format de date si la propriété est une date (ex: 'dd/MM/yyyy')
 * @returns Le tableau trié (modifie le tableau original)
 */
export function sortArray<T>(
    array: T[],
    property?: keyof T,
    direction: SortDirection = 'asc',
    dateFormat?: string
): T[] {
    return array.sort((a, b) => {
        const valueA = property ? (a[property] ?? '') : a;
        const valueB = property ? (b[property] ?? '') : b; // Tri sur dates
        if (dateFormat && typeof valueA === 'string' && typeof valueB === 'string') {
            const dateA = textToDate(valueA, dateFormat);
            const dateB = textToDate(valueB, dateFormat);

            if (!dateA || !dateB) return 0;
            if (dateEquals(dateA, dateB)) return 0;
            const comparison = dateBefore(dateA, dateB) ? -1 : 1;
            return direction === 'asc' ? comparison : -comparison;
        }

        // Tri standard
        if (valueA === valueB) return 0;
        const comparison = valueA < valueB ? -1 : 1;
        return direction === 'asc' ? comparison : -comparison;
    });
}

/**
 * Filtre un tableau selon plusieurs critères
 * @param array - Le tableau à filtrer
 * @param filters - Liste de filtres à appliquer
 * @returns Nouveau tableau filtré
 */
export function filterArray<T>(array: T[], filters: ArrayFilter<T>[] = []): T[] {
    return array.filter((item) => {
        return filters.every((filter) => {
            const itemValue = item[filter.property];
            switch (filter.type) {
                case 'equals':
                    if (filter.dateType === 'date' && filter.format && typeof itemValue === 'string') {
                        const date1 = textToDate(itemValue, filter.format);
                        const date2 = textToDate(filter.value, filter.format);
                        if (!date1 || !date2) return false;
                        return dateEquals(date1, date2);
                    }
                    return itemValue === filter.value;
                case 'before':
                    if (filter.dateType === 'date' && filter.format && typeof itemValue === 'string') {
                        const date1 = textToDate(itemValue, filter.format);
                        const date2 = textToDate(filter.value, filter.format);
                        if (!date1 || !date2) return false;
                        return dateBefore(date1, date2);
                    }
                    return itemValue < filter.value;

                case 'after':
                    if (filter.dateType === 'date' && filter.format && typeof itemValue === 'string') {
                        const date1 = textToDate(itemValue, filter.format);
                        const date2 = textToDate(filter.value, filter.format);
                        if (!date1 || !date2) return false;
                        return dateAfter(date1, date2);
                    }
                    return itemValue > filter.value;

                case 'between':
                    if (filter.dateType === 'date' && filter.format && typeof itemValue === 'string') {
                        const date = textToDate(itemValue, filter.format);
                        const min = textToDate(filter.min, filter.format);
                        const max = textToDate(filter.max, filter.format);
                        if (!date || !min || !max) return false;
                        return (
                            (dateAfter(date, min) || dateEquals(date, min)) &&
                            (dateBefore(date, max) || dateEquals(date, max))
                        );
                    }
                    return itemValue >= filter.min && itemValue <= filter.max;

                case 'contains':
                    return String(itemValue).includes(String(filter.value));

                case 'starts':
                    return String(itemValue).trim().startsWith(String(filter.value));

                case 'ends':
                    return String(itemValue).trim().endsWith(String(filter.value));

                case 'in':
                    return String(filter.value)
                        .split(',')
                        .map((el) => el.trim())
                        .includes(String(itemValue));

                default:
                    return true;
            }
        });
    });
}

/**
 * Groupe les éléments d'un tableau par une propriété
 * @param array - Le tableau à grouper
 * @param property - La propriété sur laquelle grouper
 * @returns Un objet avec les groupes
 */
export function groupBy<T>(array: T[], property: keyof T): Record<string, T[]> {
    return array.reduce(
        (groups, item) => {
            const key = String(item[property]);
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        },
        {} as Record<string, T[]>
    );
}

/**
 * Supprime les doublons d'un tableau
 * @param array - Le tableau
 * @param property - Propriété optionnelle pour comparer les objets
 * @returns Nouveau tableau sans doublons
 */
export function unique<T>(array: T[], property?: keyof T): T[] {
    if (!property) {
        return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter((item) => {
        const key = item[property];
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

/**
 * Divise un tableau en chunks de taille donnée
 * @param array - Le tableau à diviser
 * @param size - Taille de chaque chunk
 * @returns Tableau de chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
