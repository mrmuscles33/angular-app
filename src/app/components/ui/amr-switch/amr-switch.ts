import { Component, input, output, model } from '@angular/core';
import { randomString } from '@app/utils/string.utils';

@Component({
    selector: 'amr-switch',
    standalone: true,
    imports: [],
    templateUrl: './amr-switch.html',
    styleUrl: './amr-switch.scss',
    host: {
        '[class]': 'class()',
    },
})
export class AmrSwitch {
    // Inputs
    label = input<string>('');
    disabled = input<boolean>(false);
    class = input<string>('');

    // Models
    checked = model<boolean>(false);

    // Outputs
    amrChange = output<Event>();

    // ID unique généré une seule fois à la construction
    protected readonly switchId = `switch-${randomString()}`;

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
