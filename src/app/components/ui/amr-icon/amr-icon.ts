import { Component, input } from '@angular/core';

@Component({
    selector: 'amr-icon',
    standalone: true,
    template: `
        <span [class]="iconClasses()" [attr.aria-hidden]="true">
            {{ name() }}
        </span>
    `,
    styles: [
        `
            :host {
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
        `,
    ],
})
export class AmrIcon {
    // Nom de l'icône Material (ex: 'home', 'search', 'favorite')
    name = input.required<string>();

    // Taille de l'icône
    size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

    // Variante de l'icône
    variant = input<'filled' | 'outlined' | 'round' | 'sharp' | 'two-tone'>('filled');

    // Classes personnalisées
    class = input<string>('');

    // Génère les classes CSS
    protected iconClasses() {
        const baseClass = this.getVariantClass();
        const sizeClass = this.getSizeClass();

        return `${baseClass} ${sizeClass} ${this.class()}`.trim();
    }

    private getVariantClass(): string {
        const variants = {
            filled: 'material-icons',
            outlined: 'material-icons-outlined',
            round: 'material-icons-round',
            sharp: 'material-icons-sharp',
            'two-tone': 'material-icons-two-tone',
        };
        return variants[this.variant()];
    }

    private getSizeClass(): string {
        const sizes = {
            sm: 'text-base', // 16px
            md: 'text-2xl', // 24px
            lg: 'text-4xl', // 36px
            xl: 'text-6xl', // 48px
        };
        return sizes[this.size()];
    }
}
