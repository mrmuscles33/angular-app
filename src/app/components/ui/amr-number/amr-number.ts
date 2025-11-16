import { Component, input } from '@angular/core';
import { AmrText } from '../amr-text/amr-text';

@Component({
    selector: 'amr-number',
    templateUrl: '../amr-text/amr-text.html',
    styleUrl: '../amr-text/amr-text.scss',
    imports: [],
})
export class AmrNumber extends AmrText<number> {
    // Inputs spécifiques au nombre
    integer = input<number>(9); // Nombre de chiffres entiers
    decimal = input<number>(2); // Nombre de chiffres décimaux (0 = entier uniquement)
    min = input<number | null>(null); // Valeur minimale (null = pas de limite)
    max = input<number | null>(null); // Valeur maximale (null = pas de limite)

    // Overrides
    // -- Type
    protected override getDefaultType(): string {
        return 'number';
    }

    // -- Pattern
    protected override getDefaultPattern(): string {
        const dec = this.decimal();
        const int = this.integer();
        const minimum = this.min();

        // Autoriser les négatifs si min < 0 ou min non défini
        const allowNegative = minimum === null || minimum < 0;
        const negativePattern = allowNegative ? '(-?)' : '';
        if (dec > 0) {
            // Avec décimales : accepte . ou ,
            return String.raw`^${negativePattern}[0-9]{1,${int}}((\.|,)[0-9]{1,${dec}})?$`;
        } else {
            // Entier uniquement
            return String.raw`^${negativePattern}[0-9]{1,${int}}$`;
        }
    }

    // -- Format
    protected override getDefaultFormat(): string {
        const int = this.integer();
        const dec = this.decimal();
        const minimum = this.min();

        // Préfixe négatif si min < 0
        const prefix = minimum !== null && minimum < 0 ? '-' : '';

        // Format des entiers (XXX)
        const integerPart = ''.padStart(int, 'X');

        // Format des décimales (.xxx)
        const decimalPart = dec > 0 ? '.' + ''.padStart(dec, 'x') : '';

        return prefix + integerPart + decimalPart;
    }

    // -- Maxlength
    protected override getDefaultMaxlength(): number {
        const int = this.integer();
        const dec = this.decimal();
        const minimum = this.min();

        // +1 pour le signe négatif si nécessaire
        const signLength = minimum !== null && minimum < 0 ? 1 : 0;

        // +1 pour le point décimal si nécessaire
        const dotLength = dec > 0 ? 1 : 0;

        return signLength + int + dotLength + dec;
    }

    protected override validate(val: number): void {
        // Appel de la validation parente
        super.validate(val);

        if (this.errorMessage()) {
            return; // Une erreur a déjà été détectée
        }

        // Min et Max validation
        if (val) {
            const numVal = Number(val);
            if (this.min() && this.max() && (val < this.min()! || val > this.max()!)) {
                this.errorMessage.set(`La valeur doit être comprise entre ${this.min()} et ${this.max()}`);
                return;
            }
            if (this.min() && numVal < this.min()!) {
                this.errorMessage.set('La valeur doit être supérieure à ' + this.min());
                return;
            }
            if (this.max() && numVal > this.max()!) {
                this.errorMessage.set('La valeur doit être inférieure à ' + this.max());
                return;
            }
        }
        this.errorMessage.set('');
    }
}
