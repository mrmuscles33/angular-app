import { Component } from '@angular/core';
import { AmrText } from '../amr-text/amr-text';

@Component({
    selector: 'amr-email',
    templateUrl: '../amr-text/amr-text.html',
    styleUrl: '../amr-text/amr-text.scss',
    imports: [],
})
export class AmrEmail extends AmrText {
    // Overrides
    // -- Type
    protected override getDefaultType(): string {
        return 'email';
    }
    // -- Pattern
    protected override getDefaultPattern(): string {
        return String.raw`^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9_\.\-]+\.[a-zA-Z]{2,4}$`;
    }
    // -- Format
    protected override getDefaultFormat(): string {
        return 'exemple@domaine.com';
    }
}
