import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AmrButton } from './components/ui/amr-button/amr-button';
import { AmrIcon } from './components/ui/amr-icon/amr-icon';
import { AmrCheckbox } from './components/ui/amr-checkbox/amr-checkbox';
import { AmrRadio } from './components/ui/amr-radio/amr-radio';
import { AmrSwitch } from './components/ui/amr-switch/amr-switch';
import { AmrText } from './components/ui/amr-text/amr-text';
import { AmrPassword } from './components/ui/amr-password/amr-password';
import { AmrNumber } from './components/ui/amr-number/amr-number';
import { AmrEmail } from './components/ui/amr-email/amr-email';
import { AmrPhone } from './components/ui/amr-phone/amr-phone';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        AmrButton,
        AmrIcon,
        AmrCheckbox,
        AmrRadio,
        AmrSwitch,
        AmrText,
        AmrPassword,
        AmrNumber,
        AmrEmail,
        AmrPhone,
    ],
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

    onCheckboxChange(event: Event, label: string) {
        const checked = (event.target as HTMLInputElement).checked;
        console.log(`${label} is now: ${checked}`);
    }

    onRadioChange(event: Event, label: string) {
        const selectedValue = (event.target as HTMLInputElement).value;
        console.log(`${label} changed, selected value:`, selectedValue);
    }

    onSwitchChange(event: Event, label: string) {
        const checked = (event.target as HTMLInputElement).checked;
        console.log(`${label} is now: ${checked}`);
    }
}
