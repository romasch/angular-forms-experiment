import {Directive, ElementRef, Input} from '@angular/core';
import {ControlledInput} from './controlled-input';

@Directive({
    selector: 'input [type="number"] [controlledBy]'
})
export class NumberInputDirective {

    // tslint:disable-next-line:no-input-rename
    @Input('controlledBy')
    controlled: ControlledInput<number>;

    constructor(private element: ElementRef) {
        console.log('Number Input Directive', element);
    }

}
