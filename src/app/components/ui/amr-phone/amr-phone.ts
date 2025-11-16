import { Component } from '@angular/core';
import { AmrText } from '../amr-text/amr-text';

@Component({
    selector: 'amr-phone',
    templateUrl: '../amr-text/amr-text.html',
    styleUrl: '../amr-text/amr-text.scss',
    imports: [],
})
export class AmrPhone extends AmrText<string> {
    // Overrides
    // -- Type
    protected override getDefaultType(): string {
        return 'tel';
    }
    // -- Pattern
    protected override getDefaultPattern(): string {
        return String.raw`^\+?(\d[\d\-\. ]+)?(\([\d\-\. ]+\))?\d[\d\-\. ]+\d$`;
    }
    // -- Format
    protected override getDefaultFormat(): string {
        return '01.23.45.67.89';
    }
    // -- Maxlength
    protected override getDefaultMaxlength(): number {
        return 20;
    }
}
