import {isNullOrUndefined} from 'util';

function ignore() {
}

export type ValidationFunction<T> = (T) => boolean;

export const required: ValidationFunction<any> = value =>  {
    return !isNullOrUndefined(value) && value !== '';
};

export interface ControlledInput<T> {
    value: T;
    readonly validations: ValidationFunction<T>[];

    onValueChange(value: T): void;

    onValueChangeWithConflict(value: T): void;
}


export class ControlledInputImpl<T> implements ControlledInput<T> {
    constructor(
        public value: T,
        readonly onValueChange: (newValue: T) => void = newValue => this.value = newValue,
        readonly validations: ValidationFunction<T>[] = []
    ) {
    }

    onValueChangeWithConflict(value: T): void {
        console.warn('CONFLICT');
        this.onValueChange(value);
    }

}
