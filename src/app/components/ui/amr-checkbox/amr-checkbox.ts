import { Component, input, output, model } from '@angular/core';
import { AmrIcon } from '../amr-icon/amr-icon';
import { randomString } from '@app/utils/string.utils';

@Component({
    selector: 'amr-checkbox',
    standalone: true,
    imports: [AmrIcon],
    templateUrl: './amr-checkbox.html',
    styleUrl: './amr-checkbox.scss',
    host: {
        '[class]': 'class()',
    },
})
export class AmrCheckbox {
    // Inputs
    label = input<string>('');
    disabled = input<boolean>(false);
    class = input<string>('');

    // Models
    checked = model<boolean>(false);

    // Outputs
    amrChange = output<Event>();

    // ID unique généré une seule fois à la construction
    protected readonly checkboxId = `checkbox-${randomString()}`;

    // Méthode appelée lors du changement
    onChange(event: Event) {
        if (this.disabled()) {
            return;
        }
        const target = event.target as HTMLInputElement;
        this.checked.set(target.checked);
        this.amrChange.emit(event);
    }
}
