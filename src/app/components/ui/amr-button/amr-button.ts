import { Component, input, output } from '@angular/core';

@Component({
    selector: 'amr-button',
    imports: [],
    host: {
        '[class]': 'class()',
    },
    templateUrl: './amr-button.html',
})
export class AmrButton {
    // Inputs
    class = input<string>('');
    text = input<string>('');
    primary = input<boolean>(false);
    bordered = input<boolean>(true);
    disabled = input<boolean>(false);

    // Outputs
    amrClick = output<Event>();

    onClick(event: Event) {
        if (this.disabled()) {
            return;
        }
        this.amrClick.emit(event);
    }
}
