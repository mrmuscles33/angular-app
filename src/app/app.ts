import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AmrButton } from './components/ui/amr-button/amr-button';
import { AmrIcon } from './components/ui/amr-icon/amr-icon';
import { AmrCheckbox } from './components/ui/amr-checkbox/amr-checkbox';
import { AmrRadio } from './components/ui/amr-radio/amr-radio';
import { AmrSwitch } from './components/ui/amr-switch/amr-switch';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, AmrButton, AmrIcon, AmrCheckbox, AmrRadio, AmrSwitch],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal<string>('angular-app');

    // checkboxes
    checkbox1 = signal(false);
    checkbox2 = signal(true);

    // radios
    radioGroup1 = signal<string>('option1'); // Valeur par défaut

    // switches
    switch1 = signal(false);
    switch2 = signal(true);
    switch3 = signal(false);

    onPrimaryButtonClick() {
        alert('Clicked !');
    }

    onCheckboxChange(checked: boolean, label: string) {
        console.log(`${label} is now: ${checked}`);
    }

    onRadioChange(event: Event, label: string) {
        console.log(`${label} changed, selected value:`, event);
    }

    onSwitchChange(checked: boolean, label: string) {
        console.log(`${label} is now: ${checked}`);
    }
}
