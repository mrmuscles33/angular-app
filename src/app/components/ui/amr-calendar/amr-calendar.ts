import {
    afterNextRender,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    Injector,
    input,
    model,
    output,
    signal,
    viewChild,
} from '@angular/core';
import * as DateUtils from '@app/utils/date.utils';
import * as KeyboardUtils from '@app/utils/keyboard.utils';
import { AmrButton } from '../amr-button/amr-button';
import { AmrIcon } from '../amr-icon/amr-icon';

export interface AmrCalendarEvent {
    label: string;
    date: Date;
}

@Component({
    selector: 'amr-calendar',
    templateUrl: './amr-calendar.html',
    imports: [AmrButton, AmrIcon],
    host: {
        class: 'block',
    },
})
export class AmrCalendar {
    readonly injector = inject(Injector);
    calendarMain = viewChild.required<ElementRef<HTMLElement>>('calendarMain');

    // Inputs
    format = input<string>(DateUtils.DateFormats.D_M_Y);
    startWeek = input<number>(DateUtils.Days.MONDAY);
    min = input<string>('01/01/1900');
    max = input<string>('31/12/2099');
    readonly = input<boolean>(false);
    cls = input<string>('');
    events = input<AmrCalendarEvent[]>([]);

    // Model
    value = model<string>(DateUtils.dateToText(DateUtils.today(), this.format()));
    dateValue = computed<Date>(() => DateUtils.textToDate(this.value(), this.format()) || DateUtils.today());

    // Outputs
    selectValue = output<string>();

    // Signals internes
    focusedYear = signal<number>(this.dateValue().getFullYear());
    focusedDay = signal<Date>(this.dateValue());
    currentMonth = signal<string>(DateUtils.dateToText(this.dateValue(), DateUtils.DateFormats.M_Y));
    yearsPage = signal<number>(0);
    showYear = signal<boolean>(false);

    // Computed
    endWeek = computed<number>(() => (this.startWeek() === 0 ? 6 : this.startWeek() - 1));
    minDate = computed<Date>(() => DateUtils.textToDate(this.min(), this.format()) || new Date(1900, 0, 1));
    maxDate = computed<Date>(() => DateUtils.textToDate(this.max(), this.format()) || new Date(2099, 11, 31));

    displayedMonth = computed<string>(() => {
        const date = DateUtils.textToDate(this.currentMonth(), DateUtils.DateFormats.M_Y);
        if (!date) return '';
        return `${DateUtils.MonthNames[date.getMonth()]} ${date.getFullYear()}`;
    });

    displayedDays = computed<Date[]>(() => {
        if (this.showYear()) return [];
        const monthDate = DateUtils.textToDate(this.currentMonth(), DateUtils.DateFormats.M_Y);
        if (!monthDate) return [];

        // Premier jour du mois
        let firstDay = DateUtils.firstDayOfMonth(monthDate);

        // Ajuster au début de la semaine
        if (firstDay.getDay() !== this.startWeek()) {
            if (firstDay.getDay() > this.startWeek()) {
                firstDay = DateUtils.addDays(firstDay, -(firstDay.getDay() - this.startWeek()));
            } else {
                firstDay = DateUtils.addDays(firstDay, -(7 - (this.startWeek() - firstDay.getDay())));
            }
        }

        // Dernier jour du mois
        let lastDay = DateUtils.lastDayOfMonth(monthDate);

        // Ajuster à la fin de la semaine
        if (lastDay.getDay() !== this.endWeek()) {
            if (lastDay.getDay() < this.endWeek()) {
                lastDay = DateUtils.addDays(lastDay, this.endWeek() - lastDay.getDay());
            } else {
                lastDay = DateUtils.addDays(lastDay, 7 - (lastDay.getDay() - this.endWeek()));
            }
        }

        // Générer tous les jours
        const days: Date[] = [];
        let currentDay = DateUtils.copyDate(firstDay);

        while (currentDay <= lastDay) {
            days.push(DateUtils.copyDate(currentDay));
            currentDay = DateUtils.addDays(currentDay, 1);
        }

        return days;
    });

    displayedYears = computed<number[]>(() => {
        if (!this.showYear()) return [];
        const years: number[] = [];
        for (let i = this.minDate().getFullYear(); i <= this.maxDate().getFullYear(); i++) {
            years.push(i);
        }

        // Filtrer pour afficher seulement 21 années
        const start = this.yearsPage() * 21;
        const end = start + 21;
        return years.slice(start, end);
    });

    sortedDays = computed<string[]>(() => {
        const days = DateUtils.DayNames;
        return [...days.slice(this.startWeek(), 7), ...days.slice(0, this.startWeek())];
    });

    isPreviousDisabled = computed<boolean>(() => {
        if (this.showYear()) {
            return this.yearsPage() === 0;
        } else {
            return this.displayedDays().some((d) => DateUtils.dateEquals(d, this.minDate()));
        }
    });

    isNextDisabled = computed<boolean>(() => {
        if (this.showYear()) {
            return this.displayedYears().includes(this.maxDate().getFullYear());
        }
        return this.displayedDays().some((d) => DateUtils.dateEquals(d, this.maxDate()));
    });

    constructor() {
        effect(() => {
            // Date à focus
            const focused =
                this.displayedDays().find((day) => DateUtils.dateEquals(day, this.focusedDay())) ||
                this.displayedDays().find((day) => DateUtils.dateEquals(day, this.dateValue())) ||
                this.displayedDays()[0];
            if (focused) {
                this.focusedDay.set(focused);
            }
        });
        effect(() => {
            // Année à focus
            const focused =
                this.displayedYears().find((year) => year === this.focusedYear()) ||
                this.displayedYears().find((year) => year === this.dateValue().getFullYear()) ||
                this.displayedYears()[0];
            if (focused) {
                this.focusedYear.set(focused);
            }
        });
    }

    // Méthodes
    onClickYearButton(): void {
        this.showYear.set(!this.showYear());
        // Trouver la page de l'année actuelle
        const page = Math.floor((this.dateValue().getFullYear() - this.minDate().getFullYear()) / 21);
        this.yearsPage.set(page);
        afterNextRender(
            () => {
                if (this.showYear()) {
                    this.focusYear(this.focusedYear());
                } else {
                    this.focusDay(this.focusedDay());
                }
            },
            { injector: this.injector }
        );
    }

    onClickPrevious(): void {
        if (this.readonly() || this.isPreviousDisabled()) return;
        if (this.showYear()) {
            if (this.yearsPage() > 0) {
                this.yearsPage.set(this.yearsPage() - 1);
            }
        } else {
            const monthDate = DateUtils.textToDate(this.currentMonth(), DateUtils.DateFormats.M_Y);
            if (monthDate) {
                const prevMonth = DateUtils.addMonths(monthDate, -1);
                this.currentMonth.set(DateUtils.dateToText(prevMonth, DateUtils.DateFormats.M_Y));
            }
        }
    }

    onClickNext(): void {
        if (this.showYear()) {
            if (this.displayedYears().length === 21) {
                this.yearsPage.set(this.yearsPage() + 1);
            }
            return;
        }

        if (!this.isNextDisabled()) {
            const monthDate = DateUtils.textToDate(this.currentMonth(), DateUtils.DateFormats.M_Y);
            if (monthDate) {
                const nextMonth = DateUtils.addMonths(monthDate, 1);
                this.currentMonth.set(DateUtils.dateToText(nextMonth, DateUtils.DateFormats.M_Y));
            }
        }
    }

    onClickDay(event: Event, day: Date): void {
        if (this.readonly()) return;
        if (day < this.minDate() || day > this.maxDate()) return;

        const newValue = DateUtils.dateToText(day, this.format());
        this.value.set(newValue);
        this.selectValue.emit(newValue);
    }

    onClickYear(year: number): void {
        if (this.readonly()) return;

        const currentDate = DateUtils.textToDate(this.value(), this.format());
        if (currentDate) {
            currentDate.setFullYear(year);
            // const newValue = DateUtils.dateToText(currentDate, this.format());
            // this.value.set(newValue);
            this.currentMonth.set(DateUtils.dateToText(currentDate, DateUtils.DateFormats.M_Y));
        }

        this.onClickYearButton();
    }

    onKeyDownDay(event: KeyboardEvent, day: Date): void {
        if (!KeyboardUtils.isArrow(event)) return;

        let nextDate: Date | null = null;
        if (KeyboardUtils.isArrowRight(event)) {
            nextDate = DateUtils.addDays(day, 1);
        } else if (KeyboardUtils.isArrowLeft(event)) {
            nextDate = DateUtils.addDays(day, -1);
        } else if (KeyboardUtils.isArrowDown(event)) {
            nextDate = DateUtils.addDays(day, 7);
        } else if (KeyboardUtils.isArrowUp(event)) {
            nextDate = DateUtils.addDays(day, -7);
        }

        // Si la date n'est pas valide, arrêter l'événement
        if (!nextDate || nextDate < this.minDate() || nextDate > this.maxDate()) {
            KeyboardUtils.stopEvent(event);
            return;
        }

        // Mettre à jour le jour focusé
        this.focusedDay.set(nextDate);

        // Changer de mois si nécessaire
        const currentMonthDate = DateUtils.textToDate(this.currentMonth(), DateUtils.DateFormats.M_Y);
        if (currentMonthDate && nextDate.getMonth() !== currentMonthDate.getMonth()) {
            this.currentMonth.set(DateUtils.dateToText(nextDate, DateUtils.DateFormats.M_Y));
        }

        // Attendre le prochain rendu pour focus
        afterNextRender(this.focusDay.bind(this, nextDate), { injector: this.injector });
        KeyboardUtils.stopEvent(event);
    }

    private focusDay(date: Date): void {
        this.calendarMain()
            ?.nativeElement?.querySelector<HTMLElement>(`.calendar-day[value="${this.dateToText(date)}"]`)
            ?.focus();
    }

    onKeyDownYear(event: KeyboardEvent, year: number): void {
        if (this.readonly() || !KeyboardUtils.isArrow(event)) return;
        let nextYear: number | null = null;

        if (KeyboardUtils.isArrowRight(event)) {
            nextYear = year + 1;
        } else if (KeyboardUtils.isArrowLeft(event)) {
            nextYear = year - 1;
        } else if (KeyboardUtils.isArrowDown(event)) {
            nextYear = year + 3;
        } else if (KeyboardUtils.isArrowUp(event)) {
            nextYear = year - 3;
        }

        if (!nextYear || nextYear < this.minDate().getFullYear() || nextYear > this.maxDate().getFullYear()) {
            KeyboardUtils.stopEvent(event);
            return;
        }

        this.focusedYear.set(nextYear);
        const page = Math.floor((nextYear - this.minDate().getFullYear()) / 21);
        this.yearsPage.set(page);
        afterNextRender(this.focusYear.bind(this, nextYear), { injector: this.injector });
        KeyboardUtils.stopEvent(event);
    }

    private focusYear(year: number): void {
        this.calendarMain()?.nativeElement?.querySelector<HTMLElement>(`.calendar-year[value="${year}"]`)?.focus();
    }

    isDayInCurrentMonth(day: Date): boolean {
        return (DateUtils.dateToText(day, DateUtils.DateFormats.M_Y) || '') == this.currentMonth();
    }

    isDayDisabled(day: Date): boolean {
        return day < this.minDate() || day > this.maxDate();
    }

    isDayToday(day: Date): boolean {
        return DateUtils.dateEquals(day, DateUtils.today());
    }

    isDaySelected(day: Date): boolean {
        return DateUtils.dateEquals(day, this.dateValue());
    }

    isDayFocused(day: Date): boolean {
        return DateUtils.dateEquals(day, this.focusedDay());
    }

    isYearToday(year: number): boolean {
        return year === DateUtils.today().getFullYear();
    }

    isYearSelected(year: number): boolean {
        return year === this.dateValue().getFullYear();
    }

    isYearFocused(year: number): boolean {
        return year === this.focusedYear();
    }

    dateToText(date: Date) {
        return DateUtils.dateToText(date, this.format());
    }

    getEvents(day: Date): AmrCalendarEvent[] {
        return this.events().filter((event) => DateUtils.dateEquals(event.date, day));
    }
}
