import {ImmediateValidation} from './immediate-validation';

export function required(): ImmediateValidation<unknown> {
    // TODO: doesn't work with zero...
    const isNotEmpty = value => !!value;
    return new ImmediateValidation<unknown>('uf.required', isNotEmpty);
}

export function validEmail(): ImmediateValidation<string> {
    const test = email => /\S+@\S+\.\S+/.test(email);
    return new ImmediateValidation<string>('uf.valid.email', test);
}

export function min(lowerBound: number): ImmediateValidation<number> {
    return new ImmediateValidation<number>('uf.minimum.value', value => lowerBound <= value);
}

export function max(upperBound: number): ImmediateValidation<number> {
    return new ImmediateValidation<number>('uf.maximum.value', value => value <= upperBound);
}

