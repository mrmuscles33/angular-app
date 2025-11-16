import { Component } from '@angular/core';
import { AmrText } from '../amr-text/amr-text';

@Component({
    selector: 'amr-password',
    templateUrl: '../amr-text/amr-text.html',
    styleUrl: '../amr-text/amr-text.scss',
    imports: [],
})
export class AmrPassword extends AmrText {
    // Overrides
    // -- Type
    protected override getDefaultType(): string {
        return 'password';
    }
}
