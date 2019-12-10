import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {FormFieldState} from './controlled-input';

@Directive({
    selector: 'input [type="number"] [ufState]'
})
export class NumberInputDirective {

    private _state: FormFieldState<number>;

    constructor(private element: ElementRef<HTMLInputElement>) {
    }

    @Input('ufState')
    set initialize(state: FormFieldState<number>) {
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

    private setValue(value: number) {
        this.element.nativeElement.valueAsNumber = value;
    }

    private getValue(): number {
        return this.element.nativeElement.valueAsNumber;
    }

}
