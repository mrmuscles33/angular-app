import * as DateUtils from './date.utils';
import * as TimeUtils from './time.utils';
import * as StringUtils from './string.utils';
import * as ArrayUtils from './array.utils';
import * as ObjectUtils from './object.utils';

/**
 * Expose les utilitaires dans window pour le debug
 * À utiliser uniquement en développement
 */
export function exposeDevHelpers(): void {
    (globalThis as any).DevTools = {
        DateUtils,
        TimeUtils,
        StringUtils,
        ArrayUtils,
        ObjectUtils,
    };
}
