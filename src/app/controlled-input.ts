function ignore() {
}

export interface ControlledInput<T> {
    readonly value: T;

    onValueChange(value: T): void;

    onValueChangeWithConflict(value: T): void;
}


export class ControlledInputImpl<T> implements ControlledInput<T> {
    constructor(
        readonly value: T,
        readonly onValueChange: (newVale: T) => void = ignore
    ) {
    }

    onValueChangeWithConflict(value: T): void {
        console.warn('CONFLICT');
        this.onValueChange(value);
    }

}
