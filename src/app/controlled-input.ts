import {isNullOrUndefined} from 'util';
import {Subject} from 'rxjs';
import {distinctUntilChanged, skip, startWith, tap} from 'rxjs/operators';

function ignore() {
}

export type ValidationFunction<T> = (t: T) => boolean;

export class SimpleValidation<T> {
    constructor(readonly key: string, readonly validate: ValidationFunction<T>) {
    }
}

export const required: SimpleValidation<any> = new SimpleValidation('ef.required', value => !isNullOrUndefined(value) && value !== '');

export interface ControlledInput<T> {
    value: T;

    isValid(): boolean;

    isInvalid(): boolean;

    setValidationResult(key: string, valid: boolean);

    validate(): void;

    onValueChange(value: T): void;

    onValueChangeWithConflict(value: T): void;

    runSimpleValidations(value: T): void;

    publish(value: T): void;
}

export class ControlledInputImpl<T> implements ControlledInput<T> {

    private readonly validationResults = new Map<string, boolean | null>();
    private readonly valueChange: Subject<T>;

    constructor(
        public value: T,
        readonly onValueChange: (newValue: T) => void = newValue => this.value = newValue,
        readonly validations: SimpleValidation<T>[] = []
    ) {
        this.valueChange = new Subject<T>();
        this.valueChange
            .pipe(
                startWith(value),
                distinctUntilChanged(),
                skip(1),
                tap(v => console.log('Value changed: ', v)))
            .subscribe(onValueChange);
    }

    publish(value: T) {
        this.valueChange.next(value);
    }

    onValueChangeWithConflict(value: T): void {
        console.warn('CONFLICT');
        this.onValueChange(value);
    }

    validate(): void {
        this.runSimpleValidations(this.value);
    }

    isValid(): boolean {
        for (const value of this.validationResults.values()) {
            if (value === false || value === null) {
                return false;
            }
        }
        return true;
    }

    isInvalid(): boolean {
        for (const value of this.validationResults.values()) {
            if (value === false) {
                return true;
            }
        }
        return false;
    }

    getValidationErrors(): string[] {
        const result: string[] = [];
        for (const [key, value] of this.validationResults) {
            if (value === false) {
                result.push(key);
            }
        }
        return result;
    }

    setValidationResult(key: string, valid: boolean | null) {
        this.validationResults.set(key, valid);
    }

    runSimpleValidations(value: T): void {
        this.validations.forEach(validation => this.setValidationResult(validation.key, validation.validate(value)));
    }
}


// export interface Input2<T> {
//     // external API
//     getValue(): T;
//     setValue(t: T);
//     isValid(): boolean;
//     setValidationResult(key: string, isValid: boolean);
//
//     // Internal API
//     subscribe(onValueChanged: (value: T) => void);
//     publish(newValue: T, oldValue: T, conflictingValue: T): void; // internal use only
// }
//
// class Input2Impl<T> implements Input2<T> {
//
//     private failedValidations: Set<string>;
//
//     constructor(
//         private readonly value$: BehaviorSubject<T>,
//         private readonly valueChanged$: Subject<[T, T, T]>,
//     ) {
//     }
//
//     getValue(): T {
//         return this.value$.getValue();
//     }
//
//     setValue(t: T): void {
//         this.value$.next(t);
//     }
//
//     isValid(): boolean {
//         return this.failedValidations.size > 0;
//     }
//
//     setValidationResult(key: string, valid: boolean): void {
//         if (valid) {
//             this.failedValidations.delete(key);
//         } else {
//             this.failedValidations.add(key);
//         }
//     }
//
//     subscribe(onValueChanged: (value: T) => void): void {
//         this.value$.subscribe(onValueChanged);
//     }
//
//     publish(newValue: T, oldValue: T, conflictingValue: T): void {
//         this.valueChanged$.next([newValue, oldValue, conflictingValue]);
//     }
// }
//
// class Builder<T> {
//
//     private initial: T = undefined;
//     private automaticValueUpdate = true;
//     private subscribers: Array<(newValue: T, oldValue: T, conflictingValue: T) => void> = [];
//
//     public initialValue(value: T): this {
//         return this;
//     }
//
//     whenValueChanged(fn: (newValue: T, oldValue: T, conflictingValue: T) => void): this {
//         return this;
//     }
//
//     preventAutomaticValueUpdate(): this {
//         return this;
//     }
//
//     required(): this {
//         this.subscribers.push(value => );
//         return this;
//     }
//
//     build(): Input2<T> {
//         const input = new BehaviorSubject<T>(this.initial);
//         const output = new Subject<[T, T, T]>();
//         if (this.automaticValueUpdate) {
//             this.subscribers.push(v => input.next(v));
//         }
//         this.subscribers.forEach(fn =>
//             output.subscribe(([newValue, oldValue, conflictingValue]) =>
//                 fn(newValue, oldValue, conflictingValue)));
//         return new Input2Impl(input, output);
//     }
// }
