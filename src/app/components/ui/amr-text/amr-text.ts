import {
    Component,
    computed,
    effect,
    ElementRef,
    input,
    model,
    output,
    signal,
    untracked,
    viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { randomString } from '@app/utils/string.utils';

@Component({
    selector: 'amr-text',
    templateUrl: './amr-text.html',
    styleUrl: './amr-text.scss',
    imports: [],
})
export class AmrText<T = string> implements ControlValueAccessor {
    // Models
    value = model<T>();

    // Inputs
    label = input<string>('');
    type = input<string>('');
    placeholder = input<string>('.');
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);
    required = input<boolean>(false);
    filled = input<boolean>(true);
    maxlength = input<number>();
    pattern = input<string>('');
    format = input<string>('');
    name = input<string>('');
    cls = input<string>('');

    // Allow subclasses to override default values
    protected readonly _type = computed<string>(() => this.type() || this.getDefaultType());
    protected getDefaultType(): string {
        return 'text';
    }
    protected readonly _pattern = computed<string>(() => this.pattern() || this.getDefaultPattern());
    protected getDefaultPattern(): string {
        return '';
    }
    protected readonly _format = computed<string>(() => this.format() || this.getDefaultFormat());
    protected getDefaultFormat(): string {
        return '';
    }
    protected readonly _maxlength = computed<number>(() => this.maxlength() || this.getDefaultMaxlength());
    protected getDefaultMaxlength(): number {
        return 128;
    }

    // ID unique généré une seule fois à la construction
    protected readonly textId = `${this._type()}-${randomString()}`;

    // Signals
    errorMessage = signal<string>('');

    // Computed
    tabindex = computed<number>(() => (this.readonly() || this.disabled() ? -1 : 0));
    strValue = computed<string>(() => (this.value() ? String(this.value()) : ''));

    // Outputs
    valueChanged = output<T>();
    inputChanged = output<T>();
    focused = output<FocusEvent>();
    focusedOut = output<FocusEvent>();
    blurred = output<FocusEvent>();
    keyPressed = output<KeyboardEvent>();
    keyReleased = output<KeyboardEvent>();

    // ViewChild
    inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputRef');

    constructor() {
        // Effet pour valider la valeur quand elle change
        effect(() => {
            const val = this.value() as T;
            // untracked pour eviter de tracker les variables utilisées dans la fonction validate
            untracked(() => this.validate(val));
        });
    }

    // ControlValueAccessor
    private onChange: (value: T) => void = () => {};
    private onTouched: () => void = () => {};
    writeValue(val: T): void {
        this.value.set(val);
    }
    registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    // Event handlers
    onInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const newValue = target.value as T;
        this.value.set(newValue);
        this.onChange(newValue);
        this.valueChanged.emit(newValue);
    }

    onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        const newValue = target.value as T;
        this.value.set(newValue);
        this.onChange(newValue);
        this.inputChanged.emit(newValue);
    }

    onFocus(event: FocusEvent): void {
        this.focused.emit(event);
    }

    onFocusOut(event: FocusEvent): void {
        this.onTouched();
        this.focusedOut.emit(event);
    }

    onBlur(event: FocusEvent): void {
        this.onTouched();
        this.blurred.emit(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        this.keyPressed.emit(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.keyReleased.emit(event);
    }

    onContainerClick(event: Event): void {
        if (!this.readonly() && !this.disabled()) {
            this.inputElement()?.nativeElement.focus();
        }
        event.stopPropagation();
    }

    // Validation
    protected validate(val: T): void {
        if (this.disabled()) {
            this.errorMessage.set('');
            return;
        }

        // Required validation
        if (this.required() && !val) {
            this.errorMessage.set(`La donnée ${this.label()} est obligatoire`);
            return;
        }

        // Pattern validation
        if (this._pattern() && val) {
            const regex = new RegExp(this._pattern());
            if (!regex.test(this.strValue())) {
                if (this._format()) {
                    this.errorMessage.set(`La donnée ${this.label()} doit être au format ${this._format()}`);
                } else {
                    this.errorMessage.set(`Erreur dans le format de la donnée ${this.label()}`);
                }
                return;
            }
        }

        // Maxlength validation
        if (this.strValue().length > this._maxlength()) {
            this.errorMessage.set(`La donnée ${this.label()} ne doit pas dépasser ${this._maxlength()} caractères`);
            return;
        }

        this.errorMessage.set('');
    }
}
