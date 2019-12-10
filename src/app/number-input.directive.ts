import {Directive, ElementRef, HostBinding, HostListener, Input} from '@angular/core';
import {ControlledInput, FormFieldState} from './controlled-input';

@Directive({
    selector: 'input [type="number"] [state]'
})
export class NumberInputDirective {

    @HostBinding('class.is-pristine')
    isPristine = true; // TODO

    private _state: FormFieldState<number>;

    constructor(private element: ElementRef<HTMLInputElement>) {
    }

    @HostBinding('class.is-conflict')
    get isConflict(): boolean {
        return this._state.isConflict();
    }

    @HostBinding('class.is-invalid')
    get isInvalid(): boolean {
        // this.element.nativeElement.setCustomValidity(isInvalid ? 'ERROR' : '');
        return this._state.getValidationResults().isInvalid();
    }

    @HostBinding('class.is-valid')
    get isValid(): boolean {
        return this._state.getValidationResults().isValid() && !this.isPristine;
    }

    @HostBinding('class.is-dirty')
    get isDirty(): boolean {
        return !this.isPristine;
    }

    @Input('state')
    set state(state: FormFieldState<number>) {
        if (this._state) {
            throw new Error('Cannot change form state after initialization.');
        }
        state.initialize(v => this.setValue(v));
        this._state = state;
    }

    @HostListener('focus')
    onFocus(): void {
        this._state.registerFocus();
        // this.checkConsistency();
        // this.isFocused = true;
        // this.valueBeforeFocus = this.control.value;
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
        this.element.nativeElement.blur(); // TODO: really necessary?
    }

    @HostListener('keydown.enter')
    enter() {
        this._state.registerValueCommitted(this.getValue());
    }

    private setValue(value: number) {
        this.element.nativeElement.valueAsNumber = value;
    }

    private getValue(): number {
        return this.element.nativeElement.valueAsNumber;
    }

}
