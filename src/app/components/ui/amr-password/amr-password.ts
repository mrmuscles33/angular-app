import { Component, signal } from '@angular/core';
import { AmrText } from '../amr-text/amr-text';
import { AmrIcon } from '../amr-icon/amr-icon';

@Component({
    selector: 'amr-password',
    templateUrl: '../amr-password/amr-password.html',
    styleUrl: '../amr-text/amr-text.scss',
    imports: [AmrText, AmrIcon],
})
export class AmrPassword extends AmrText {
    // Signal pour gérer la visibilité du mot de passe
    showPassword = signal<boolean>(false);

    // Overrides
    protected override getDefaultType(): string {
        return 'password';
    }

    // Events
    togglePasswordVisibility() {
        if (this.disabled() || this.readonly()) {
            return;
        }
        this.showPassword.set(!this.showPassword());
    }
}
