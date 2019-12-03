import {Directive, ElementRef, HostBinding, HostListener, Input} from '@angular/core';
import {ControlledInput} from './controlled-input';

@Directive({
    selector: 'input [type="text"] [efControl]'
})
export class TextInputDirective {

    @HostBinding('class.is-conflict')
    isConflict = false;

    @HostBinding('class.is-pristine')
    isPristine = true;

    private control: ControlledInput<string>;
    private isFocused = false;

    constructor(private element: ElementRef<HTMLInputElement>) {
        console.log('Text Input Directive', element);
    }

    @HostBinding('class.is-invalid')
    get invalid(): boolean {
        // this.element.nativeElement.setCustomValidity(isInvalid ? 'ERROR' : '');
        return this.control.isInvalid();
    }

    @HostBinding('class.is-valid')
    get valid(): boolean {
        return this.control.isValid() && !this.isPristine;
    }

    @Input('efControl')
    set efControl(ctrl: ControlledInput<string>) {
        if (this.isFocused) {
            if (this.control.value !== ctrl.value) {
                this.isConflict = true;
            }
        } else {
            this.element.nativeElement.value = ctrl.value;
        }
        this.control = ctrl;
    }

    @HostListener('focus')
    focus(): void {
        this.isFocused = true;
    }

    @HostListener('blur')
    blur(): void {
        console.log('blurred');
        const conflict: boolean = this.isConflict;
        const value = this.element.nativeElement.value;
        this.isFocused = false;
        this.isConflict = false;
        this.isPristine = false;
        // TODO: check if there is a real change
        if (conflict) {
            this.control.onValueChangeWithConflict(value);
        } else {
            this.control.onValueChange(value);
        }
    }

    @HostListener('input') // TODO: find a better event.
    onChange() {
        this.control.runSimpleValidations(this.element.nativeElement.value);
    }

    @HostListener('keydown.tab')
    tab() {
        // Needs to be caught, because the tab happens before the blur event, and thus it has a potential to
        // lose focus on the next input element if it is conditionally displayed.
        this.blur();
        // TODO: avoid double change event
    }

    @HostListener('keydown.esc')
    escape(): void {
        this.setValue(this.control.value);
        this.element.nativeElement.blur();
    }

    @HostListener('keydown.enter')
    enter() {
        // The enter key can trigger a form submit, so we must publish the new value before.
        this.blur();
    }

    private setValue(value: string) {
        this.element.nativeElement.value = value;
    }

}
