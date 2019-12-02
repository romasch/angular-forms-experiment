function ignore() {
}

export interface ControlledInput<T> {
    value: T;

    onValueChange(value: T): void;

    onValueChangeWithConflict(value: T): void;
}


export class ControlledInputImpl<T> implements ControlledInput<T> {
    constructor(
        public value: T,
        readonly onValueChange: (newValue: T) => void = newValue => this.value = newValue
    ) {
    }

    onValueChangeWithConflict(value: T): void {
        console.warn('CONFLICT');
        this.onValueChange(value);
    }

}
