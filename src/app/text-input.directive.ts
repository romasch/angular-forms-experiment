import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {FormFieldState} from './controlled-input';

@Directive({
    selector: 'input [type="text"] [ufState], input [type="email"] [ufState]'
})
export class TextInputDirective {

    private _state: FormFieldState<string>;

    constructor(private element: ElementRef<HTMLInputElement>) {
    }

    @Input('ufState')
    set initialize(state: FormFieldState<string>) {
        if (this._state) {
            throw new Error('Cannot change form state after initialization.');
        }
        state.initialize(v => this.setValue(v));
        this._state = state;
    }

    @HostListener('focus')
    onFocus(): void {
        this._state.registerFocus();
    }

    @HostListener('blur')
    onBlur(): void {
        this._state.registerValueCommitted(this.getValue());
        this._state.registerBlur();
    }

    @HostListener('input')
    onChange() {
        this._state.registerValueChanged(this.getValue());
    }

    @HostListener('keydown.tab')
    onTab() {
        this._state.registerValueCommitted(this.getValue());
    }

    @HostListener('keydown.esc')
    escape(): void {
        this._state.discardChanges();
        this.element.nativeElement.blur();
    }

    @HostListener('keydown.enter')
    enter() {
        this._state.registerValueCommitted(this.getValue());
    }

    private setValue(value: string) {
        this.element.nativeElement.value = value;
    }

    private getValue(): string {
        return this.element.nativeElement.value;
    }


    //
    // @HostBinding('class.is-pristine')
    // isPristine = true;
    //
    // private control: ControlledInput<string>;
    // private isFocused = false;
    // private valueBeforeFocus: string;
    //
    // constructor(private element: ElementRef<HTMLInputElement>) {
    // }
    //
    // @HostBinding('class.is-conflict')
    // get isConflict(): boolean {
    //     return this.isFocused && !Object.is(this.valueBeforeFocus, this.control.value);
    // }
    //
    // @HostBinding('class.is-invalid')
    // get isInvalid(): boolean {
    //     // this.element.nativeElement.setCustomValidity(isInvalid ? 'ERROR' : '');
    //     return this.control.validationResults.isInvalid();
    // }
    //
    // @HostBinding('class.is-valid')
    // get isValid(): boolean {
    //     return this.control.validationResults.isValid() && !this.isPristine;
    // }
    //
    // @HostBinding('class.is-dirty')
    // get isDirty(): boolean {
    //     return !this.isPristine;
    // }
    //
    // @Input('efControl')
    // set efControl(ctrl: ControlledInput<string>) {
    //     if (!this.isFocused) {
    //         this.setValue(ctrl.value);
    //     }
    //     this.control = ctrl;
    // }
    //
    // @HostListener('focus')
    // focus(): void {
    //     this.checkConsistency();
    //     this.isFocused = true;
    //     this.valueBeforeFocus = this.control.value;
    // }
    //
    // @HostListener('blur')
    // blur(): void {
    //     this.isFocused = false;
    //     this.publishWhenChanged();
    //     // TODO: set to controlled value if change happened after publish (stupid tab handling of ngbTypeahead...).
    // }
    //
    // @HostListener('input')
    // onChange() {
    //     this.control.validate(this.element.nativeElement.value);
    // }
    //
    // @HostListener('keydown.tab')
    // tab() {
    //     // Needs to be caught, because the tab happens before the blur event, and thus it has a potential to
    //     // lose focus on the next input element if it is conditionally displayed.
    //     this.publishWhenChanged();
    // }
    //
    // @HostListener('keydown.esc')
    // escape(): void {
    //     this.setValue(this.control.value);
    //     this.element.nativeElement.blur();
    // }
    //
    // @HostListener('keydown.enter')
    // enter() {
    //     // The enter key can trigger a form submit, so we must publish the new value before.
    //     this.publishWhenChanged();
    // }
    //
    // private publishWhenChanged() {
    //     const currentValue = this.element.nativeElement.value;
    //     if (currentValue === this.valueBeforeFocus) {
    //         return;
    //     }
    //     // if (currentValue === this.lastPublishedValue) {
    //     //     return;
    //     // }
    //     this.control.publish(currentValue, this.valueBeforeFocus, this.control.value);
    //     this.valueBeforeFocus = currentValue;
    //     this.isPristine = false;
    // }
    //
    //
    // private setValue(value: string) {
    //     this.element.nativeElement.value = value;
    // }
    //
    // private checkConsistency(): void {
    //     if (!this.isValueConsistent()) {
    //         console.warn('Value inconsistency detected!');
    //     }
    // }
    //
    // private isValueConsistent(): boolean {
    //     return Object.is(this.control.value, this.element.nativeElement.value);
    // }
}
