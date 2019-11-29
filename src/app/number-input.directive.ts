import {Directive, ElementRef, Input} from '@angular/core';
import {ControlledInput} from './controlled-input';

@Directive({
    selector: 'input [type="number"] [efControl]'
})
export class NumberInputDirective {

    @Input()
    efControl: ControlledInput<number>;

    constructor(private element: ElementRef) {
        console.log('Number Input Directive', element);
    }

}
