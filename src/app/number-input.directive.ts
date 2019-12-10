import {Directive, ElementRef, HostBinding, HostListener, Input} from '@angular/core';
import {ControlledInput} from './controlled-input';

@Directive({
    selector: 'input [type="number"] [efControl]'
})
export class NumberInputDirective {

    @HostBinding('class.is-pristine')
    isPristine = true;

    private control: ControlledInput<number>;
    private isFocused = false;
    private valueBeforeFocus: number;

    constructor(private element: ElementRef<HTMLInputElement>) {
    }

    @HostBinding('class.is-conflict')
    get isConflict(): boolean {
        return this.isFocused && !Object.is(this.valueBeforeFocus, this.control.value);
    }

    @HostBinding('class.is-invalid')
    get isInvalid(): boolean {
        // this.element.nativeElement.setCustomValidity(isInvalid ? 'ERROR' : '');
        return this.control.validationResults.isInvalid();
    }

    @HostBinding('class.is-valid')
    get isValid(): boolean {
        return this.control.validationResults.isValid() && !this.isPristine;
    }

    @HostBinding('class.is-dirty')
    get isDirty(): boolean {
        return !this.isPristine;
    }

    @Input('efControl')
    set efControl(ctrl: ControlledInput<number>) {
        if (!this.isFocused) {
            this.setValue(ctrl.value);
        }
        this.control = ctrl;
    }

    @HostListener('focus')
    focus(): void {
        this.checkConsistency();
        this.isFocused = true;
        this.valueBeforeFocus = this.control.value;
    }

    @HostListener('blur')
    blur(): void {
        this.isFocused = false;
        this.publishWhenChanged();
        // TODO: set to controlled value if change happened after publish (stupid tab handling of ngbTypeahead...).
    }

    @HostListener('input')
    onChange() {
        this.control.validate(this.element.nativeElement.valueAsNumber);
    }

    @HostListener('keydown.tab')
    tab() {
        // Needs to be caught, because the tab happens before the blur event, and thus it has a potential to
        // lose focus on the next input element if it is conditionally displayed.
        this.publishWhenChanged();
    }

    @HostListener('keydown.esc')
    escape(): void {
        this.setValue(this.control.value);
        this.element.nativeElement.blur();
    }

    @HostListener('keydown.enter')
    enter() {
        // The enter key can trigger a form submit, so we must publish the new value before.
        this.publishWhenChanged();
    }

    private publishWhenChanged() {
        const currentValue = this.element.nativeElement.valueAsNumber;
        if (Object.is(currentValue, this.valueBeforeFocus)) {
            return;
        }
        this.control.publish(currentValue, this.valueBeforeFocus, this.control.value);
        this.valueBeforeFocus = currentValue;
        this.isPristine = false;
    }


    private setValue(value: number) {
        this.element.nativeElement.valueAsNumber = value;
    }

    private checkConsistency(): void {
        if (!this.isValueConsistent()) {
            console.warn('Value inconsistency detected: ', this.control.value, this.element.nativeElement.valueAsNumber);
        }
    }

    private isValueConsistent(): boolean {
        return Object.is(this.control.value, this.element.nativeElement.valueAsNumber);
    }

}
