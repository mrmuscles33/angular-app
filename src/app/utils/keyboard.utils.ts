/**
 * Utilitaires pour la détection d'événements clavier
 */

/**
 * Vérifie si l'événement est la touche Entrée
 * @param event - L'événement à vérifier
 * @return true si c'est la touche Entrée
 */
export function isEnter(event: KeyboardEvent): boolean {
    return event.key === 'Enter' || event.code === 'Enter';
}

/**
 * Vérifie si l'événement est la touche Tab
 * @param event - L'événement à vérifier
 * @return true si c'est la touche Tab
 */
export function isTab(event: KeyboardEvent): boolean {
    return event.key === 'Tab' || event.code === 'Tab';
}

/**
 * Vérifie si l'événement est la flèche haut
 * @param event - L'événement à vérifier
 * @return true si c'est la flèche haut
 */
export function isArrowUp(event: KeyboardEvent): boolean {
    return event.key === 'ArrowUp' || event.code === 'ArrowUp';
}

/**
 * Vérifie si l'événement est la flèche bas
 * @param event - L'événement à vérifier
 * @return true si c'est la flèche bas
 */
export function isArrowDown(event: KeyboardEvent): boolean {
    return event.key === 'ArrowDown' || event.code === 'ArrowDown';
}

/**
 * Vérifie si l'événement est la flèche gauche
 * @param event - L'événement à vérifier
 * @return true si c'est la flèche gauche
 */
export function isArrowLeft(event: KeyboardEvent): boolean {
    return event.key === 'ArrowLeft' || event.code === 'ArrowLeft';
}

/**
 * Vérifie si l'événement est la flèche droite
 * @param event - L'événement à vérifier
 * @return true si c'est la flèche droite
 */
export function isArrowRight(event: KeyboardEvent): boolean {
    return event.key === 'ArrowRight' || event.code === 'ArrowRight';
}

/**
 * Vérifie si l'événement est une flèche (haut, bas, gauche, droite)
 * @param event - L'événement à vérifier
 * @return true si c'est une flèche
 */
export function isArrow(event: KeyboardEvent): boolean {
    return isArrowUp(event) || isArrowDown(event) || isArrowLeft(event) || isArrowRight(event);
}

/**
 * Vérifie si l'événement est la touche Échap
 * @param event - L'événement à vérifier
 * @return true si c'est la touche Échap
 */
export function isEscape(event: KeyboardEvent): boolean {
    return event.key === 'Escape' || event.code === 'Escape';
}

/**
 * Vérifie si l'événement est la touche Espace
 * @param event - L'événement à vérifier
 * @return true si c'est la touche Espace
 */
export function isSpace(event: KeyboardEvent): boolean {
    return event.key === ' ' || event.code === 'Space';
}

/**
 * Vérifie si la touche Ctrl est enfoncée
 * @param event - L'événement à vérifier
 * @return true si la touche Ctrl est enfoncée
 */
export function isCtrl(event: KeyboardEvent): boolean {
    return event.ctrlKey || event.key === 'Control' || event.code === 'ControlLeft' || event.code === 'ControlRight';
}

/**
 * Vérifie si la touche Alt est enfoncée
 * @param event - L'événement à vérifier
 * @return true si la touche Alt est enfoncée
 */
export function isAlt(event: KeyboardEvent): boolean {
    return event.altKey || event.key === 'Alt' || event.code === 'AltLeft' || event.code === 'AltRight';
}

/**
 * Vérifie si la touche Shift est enfoncée
 * @param event - L'événement à vérifier
 * @return true si la touche Shift est enfoncée
 */
export function isShift(event: KeyboardEvent): boolean {
    return event.shiftKey || event.key === 'Shift' || event.code === 'ShiftLeft' || event.code === 'ShiftRight';
}

/**
 * Vérifie si la touche Meta (Cmd sur Mac, Win sur Windows) est enfoncée
 * @param event - L'événement à vérifier
 * @return true si la touche Meta est enfoncée
 */
export function isMeta(event: KeyboardEvent): boolean {
    return event.metaKey || event.key === 'Meta' || event.code === 'MetaLeft' || event.code === 'MetaRight';
}

/**
 * Vérifie si l'événement est une touche de suppression (Backspace ou Delete)
 * @param event - L'événement à vérifier
 * @return true si c'est une touche de suppression
 */
export function isDelete(event: KeyboardEvent): boolean {
    return event.key === 'Backspace' || event.code === 'Backspace' || event.key === 'Delete' || event.code === 'Delete';
}

/**
 * Vérifie si l'événement est la touche Backspace
 * @param event - L'événement à vérifier
 * @return true si c'est la touche Backspace
 */
export function isBackspace(event: KeyboardEvent): boolean {
    return event.key === 'Backspace' || event.code === 'Backspace';
}

/**
 * Vérifie si l'événement est une combinaison Ctrl+Key (ou Cmd+Key sur Mac)
 * @param event - Événement clavier
 * @param key - Touche à vérifier (ex: 'a', 'c', 'v')
 */
export function isCtrlKey(event: KeyboardEvent, key: string): boolean {
    const modifierPressed = event.ctrlKey || event.metaKey;
    return modifierPressed && event.key.toLowerCase() === key.toLowerCase();
}

/**
 * Vérifie si l'événement correspond à Ctrl+C (copier)
 * @param event - L'événement à vérifier
 * @return true si c'est Ctrl+C
 */
export function isCopy(event: KeyboardEvent): boolean {
    return isCtrlKey(event, 'c');
}

/**
 * Vérifie si l'événement correspond à Ctrl+V (coller)
 * @param event - L'événement à vérifier
 * @return true si c'est Ctrl+V
 */
export function isPaste(event: KeyboardEvent): boolean {
    return isCtrlKey(event, 'v');
}

/**
 * Vérifie si l'événement correspond à Ctrl+X (couper)
 * @param event - L'événement à vérifier
 * @return true si c'est Ctrl+X
 */
export function isCut(event: KeyboardEvent): boolean {
    return isCtrlKey(event, 'x');
}

/**
 * Vérifie si l'événement correspond à Ctrl+Z (annuler)
 * @param event - L'événement à vérifier
 * @return true si c'est Ctrl+Z
 */
export function isUndo(event: KeyboardEvent): boolean {
    return isCtrlKey(event, 'z');
}

/**
 * Vérifie si l'événement correspond à Ctrl+Y (rétablir)
 * @param event - L'événement à vérifier
 * @return true si c'est Ctrl+Y
 */
export function isRedo(event: KeyboardEvent): boolean {
    return isCtrlKey(event, 'y') || (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z');
}

/**
 * Vérifie si l'événement correspond à Ctrl+A (tout sélectionner)
 * @param event - L'événement à vérifier
 * @return true si c'est Ctrl+A
 */
export function isSelectAll(event: KeyboardEvent): boolean {
    return isCtrlKey(event, 'a');
}

/**
 * Vérifie si l'événement est un caractère numérique
 * @param event - L'événement à vérifier
 * @return true si c'est un caractère numérique
 */
export function isNumeric(event: KeyboardEvent): boolean {
    return /^<\d>$/.test(event.key);
}

/**
 * Vérifie si l'événement est une lettre
 * @param event - L'événement à vérifier
 * @return true si c'est une lettre
 */
export function isLetter(event: KeyboardEvent): boolean {
    return /^[a-zA-Z]$/.test(event.key);
}

/**
 * Vérifie si l'événement est un caractère alphanumérique
 * @param event - L'événement à vérifier
 * @return true si c'est un caractère alphanumérique
 */
export function isAlphanumeric(event: KeyboardEvent): boolean {
    return /^[a-zA-Z0-9]$/.test(event.key);
}

/**
 * Empêche le comportement par défaut et la propagation de l'événement
 * @param event - L'événement à stopper
 */
export function stopEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
}
