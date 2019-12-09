import {isNullOrUndefined} from 'util';
import {ValidationResults} from './validation-results';

export type ValuePublishedSubscriber<T> = (value: T, previousValue: T, latestFormValue: T) => void;

export type ValidationFunction<T> = (t: T) => boolean;

export class SimpleValidation<T> {
    constructor(readonly key: string, readonly validate: ValidationFunction<T>) {
    }
}

export const required: SimpleValidation<any> = new SimpleValidation('ef.required', value => !isNullOrUndefined(value) && value !== '');

export interface ControlledInput<T> {
    value: T;
    readonly validationResults: ValidationResults;

    validate(): void;

    runSimpleValidations(value: T): void;

    publish(value: T, previousValue: T, latestFormValue: T): void;
}

export class ControlledInputImpl<T> implements ControlledInput<T> {

    readonly validationResults = new ValidationResults();
    private readonly subscribers: Array<ValuePublishedSubscriber<T>> = [];

    constructor(
        public value: T,
        onValueChange?: ValuePublishedSubscriber<T>,
        readonly validations: SimpleValidation<T>[] = []
    ) {
        if (onValueChange) {
            this.subscribers.push(onValueChange);
        }
    }

    publish(value: T, previousValue: T, latestFormValue: T) {
        // TODO: Check if default this makes sense in all cases.
        this.defaultOnValuePublished(value, previousValue, latestFormValue);
        this.subscribers.forEach(fn => fn(value, previousValue, latestFormValue));
    }

    validate(): void {
        this.runSimpleValidations(this.value);
    }

    runSimpleValidations(value: T): void {
        this.validations.forEach(validation => this.validationResults.registerValidationResult(validation.key, validation.validate(value)));
    }

    private defaultOnValuePublished(value: T, previousValue: T, latestFormValue: T): void {
        if (previousValue !== latestFormValue) {
            console.warn('CONFLICT');
        }
        this.value = value;
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
