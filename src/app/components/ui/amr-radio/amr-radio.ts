import { Component, input, output, model } from '@angular/core';
import { AmrIcon } from '../amr-icon/amr-icon';
import { randomString } from '@app/utils/string.utils';

@Component({
    selector: 'amr-radio',
    standalone: true,
    imports: [AmrIcon],
    templateUrl: './amr-radio.html',
    styleUrl: './amr-radio.scss',
    host: {
        '[class]': 'class()',
    },
})
export class AmrRadio {
    // Inputs
    label = input<string>('');
    disabled = input<boolean>(false);
    class = input<string>('');
    group = input.required<string>(); // Nom du groupe pour lier les radios
    value = input.required<string>(); // Valeur de ce radio

    // Models
    selectedValue = model<string>(''); // Valeur sélectionnée dans le groupe

    // Outputs
    changed = output<Event>();

    // ID unique généré une seule fois à la construction
    protected readonly radioId = `radio-${randomString()}`;

    // Computed: ce radio est-il sélectionné ?
    protected get isChecked(): boolean {
        return this.selectedValue() === this.value();
    }

    // Méthode appelée lors du changement
    onChange(event: Event) {
        if (this.disabled()) {
            return;
        }
        const target = event.target as HTMLInputElement;
        if (target.checked) {
            this.selectedValue.set(this.value());
        }
        this.changed.emit(event);
    }
}
