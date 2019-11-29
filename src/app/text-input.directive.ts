import {Directive, ElementRef, HostListener, Input} from '@angular/core';
import {ControlledInput} from './controlled-input';

@Directive({
    selector: 'input [type="text"] [controlledBy]'
})
export class TextInputDirective {

    private control: ControlledInput<string>;
    private isFocused = false;
    private isConflict = false;

    constructor(private element: ElementRef<HTMLInputElement>) {
        console.log('Text Input Directive', element);
    }

    @Input('controlledBy')
    set controlledBy(ctrl: ControlledInput<string>) {
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
        const conflict: boolean = this.isConflict;
        const value = this.element.nativeElement.value;
        this.isFocused = false;
        this.isConflict = false;
        if (conflict) {
            this.control.onValueChangeWithConflict(value);
        } else {
            this.control.onValueChange(value);
        }
    }

    @HostListener('keydown.esc')
    escape(): void {
        this.setValue(this.control.value);
        this.element.nativeElement.blur();
    }

    private setValue(value: string) {
        this.element.nativeElement.value = value;
    }

}
