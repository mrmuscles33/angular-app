import { Component, computed, input, model, output, signal } from '@angular/core';
import { AmrButton } from '../amr-button/amr-button';
import { AmrIcon } from '../amr-icon/amr-icon';
import * as DateUtils from '@app/utils/date.utils';
import * as KeyboardUtils from '@app/utils/keyboard.utils';

@Component({
    selector: 'amr-calendar',
    templateUrl: './amr-calendar.html',
    styleUrl: './amr-calendar.scss',
    imports: [AmrButton, AmrIcon],
    host: {
        '[class]': 'cls()',
        class: 'block',
    },
})
export class AmrCalendar {
    // Inputs
    format = input<string>(DateUtils.DateFormats.D_M_Y);
    startWeek = input<number>(DateUtils.Days.MONDAY);
    min = input<string>('01/01/1900');
    max = input<string>('31/12/2099');
    readonly = input<boolean>(false);
    cls = input<string>('');

    // Model
    value = model<string>(DateUtils.dateToText(DateUtils.today(), this.format()));
    dateValue = computed<Date>(() => DateUtils.textToDate(this.value(), this.format()) || DateUtils.today());

    // Outputs
    valueChanged = output<string>();

    // Signals internes
    focusedDate = signal<string>(this.value());
    focusedYear = signal<number>(this.dateValue().getFullYear());
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

    // Méthodes
    onClickYearButton(): void {
        this.showYear.set(!this.showYear());

        // Trouver la page de l'année actuelle
        const focusedDate = DateUtils.textToDate(this.focusedDate(), this.format());
        if (focusedDate) {
            const page = Math.floor((focusedDate.getFullYear() - this.minDate().getFullYear()) / 21);
            this.yearsPage.set(page);
        }
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
                this.focusedDate.set(DateUtils.dateToText(prevMonth, this.format()));
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
                this.focusedDate.set(DateUtils.dateToText(nextMonth, this.format()));
            }
        }
    }

    onClickDay(event: Event, day: Date): void {
        if (this.readonly()) return;

        if (day < this.minDate() || day > this.maxDate()) return;

        const newValue = DateUtils.dateToText(day, this.format());
        this.value.set(newValue);
        this.focusedDate.set(newValue);
        this.valueChanged.emit(newValue);
    }

    onClickYear(year: number): void {
        if (this.readonly()) return;

        const currentDate = DateUtils.textToDate(this.value(), this.format());
        if (currentDate) {
            currentDate.setFullYear(year);
            const newValue = DateUtils.dateToText(currentDate, this.format());
            this.value.set(newValue);
            this.focusedDate.set(newValue);
            this.currentMonth.set(DateUtils.dateToText(currentDate, DateUtils.DateFormats.M_Y));
        }

        this.onClickYearButton();
    }

    onKeyDownDay(event: KeyboardEvent, day: Date): void {
        let nextDate: Date | null = null;

        if (KeyboardUtils.isArrow(event)) {
            if (KeyboardUtils.isArrowRight(event)) {
                nextDate = DateUtils.addDays(day, 1);
            } else if (KeyboardUtils.isArrowLeft(event)) {
                nextDate = DateUtils.addDays(day, -1);
            } else if (KeyboardUtils.isArrowDown(event)) {
                nextDate = DateUtils.addDays(day, 7);
            } else if (KeyboardUtils.isArrowUp(event)) {
                nextDate = DateUtils.addDays(day, -7);
            }

            if (nextDate && nextDate >= this.minDate() && nextDate <= this.maxDate()) {
                this.focusedDate.set(DateUtils.dateToText(nextDate, this.format()));

                // Changer de mois si nécessaire
                const currentMonthDate = DateUtils.textToDate(this.currentMonth(), DateUtils.DateFormats.M_Y);
                if (currentMonthDate && nextDate.getMonth() !== currentMonthDate.getMonth()) {
                    this.currentMonth.set(DateUtils.dateToText(nextDate, DateUtils.DateFormats.M_Y));
                }
            }

            KeyboardUtils.stopEvent(event);
        } else if (KeyboardUtils.isEnter(event) || KeyboardUtils.isSpace(event)) {
            this.onClickDay(event, day);
            KeyboardUtils.stopEvent(event);
        }
    }

    onKeyDownYear(event: KeyboardEvent, year: number): void {
        let nextYear: number | null = null;

        if (KeyboardUtils.isArrow(event)) {
            if (KeyboardUtils.isArrowRight(event)) {
                nextYear = year + 1;
            } else if (KeyboardUtils.isArrowLeft(event)) {
                nextYear = year - 1;
            } else if (KeyboardUtils.isArrowDown(event)) {
                nextYear = year + 3;
            } else if (KeyboardUtils.isArrowUp(event)) {
                nextYear = year - 3;
            }

            if (
                nextYear !== null &&
                nextYear >= this.minDate().getFullYear() &&
                nextYear <= this.maxDate().getFullYear()
            ) {
                this.focusedYear.set(nextYear);
                const page = Math.floor((nextYear - this.minDate().getFullYear()) / 21);
                this.yearsPage.set(page);
            }

            KeyboardUtils.stopEvent(event);
        } else if (KeyboardUtils.isEnter(event) || KeyboardUtils.isSpace(event)) {
            this.onClickYear(year);
            KeyboardUtils.stopEvent(event);
        }
    }

    isDayInCurrentMonth(day: Date): boolean {
        return (DateUtils.dateToText(day, DateUtils.DateFormats.M_Y) || '') == this.currentMonth();
    }

    isDayDisabled(day: Date): boolean {
        return day < this.minDate() || day > this.maxDate();
    }

    isDayToday(day: Date): boolean {
        return DateUtils.isToday(day);
    }

    isDaySelected(day: Date): boolean {
        return DateUtils.dateEquals(day, DateUtils.textToDate(this.value(), this.format()) || new Date());
    }

    isDayFocused(day: Date): boolean {
        const focusedDateObj = DateUtils.textToDate(this.focusedDate(), this.format());
        return focusedDateObj ? DateUtils.dateEquals(day, focusedDateObj) : false;
    }

    isYearToday(year: number): boolean {
        return year === DateUtils.today().getFullYear();
    }

    isYearSelected(year: number): boolean {
        const selectedDate = DateUtils.textToDate(this.value(), this.format());
        return selectedDate ? year === selectedDate.getFullYear() : false;
    }

    isYearFocused(year: number): boolean {
        return year === this.focusedYear();
    }

    getDayTabIndex(day: Date): number {
        if (this.readonly()) return -1;

        const focusedDateObj = DateUtils.textToDate(this.focusedDate(), this.format());

        if (focusedDateObj && this.displayedDays().some((d) => DateUtils.dateEquals(d, focusedDateObj))) {
            return DateUtils.dateEquals(day, focusedDateObj) ? 0 : -1;
        }

        // Si la date focusée n'est pas dans le mois, focus sur le premier jour valide
        const firstValidDay = this.displayedDays().find((d) => d >= this.minDate() && d <= this.maxDate());

        return firstValidDay && DateUtils.dateEquals(day, firstValidDay) ? 0 : -1;
    }

    getYearTabIndex(year: number): number {
        if (this.readonly()) return -1;

        if (this.displayedYears().includes(this.focusedYear())) {
            return year === this.focusedYear() ? 0 : -1;
        }

        return year === this.displayedYears()[0] ? 0 : -1;
    }
}
