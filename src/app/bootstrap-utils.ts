import {FormFieldState} from './form-field-state/form-field-state';

export interface NgClassSet {
    [klass: string]: boolean;
}

export function toBootstrapClassList(state: FormFieldState<unknown>): NgClassSet {
    return {
        'form-control': true,
        'is-valid': state.isTouched() && state.getValidationState().isValid(),
        'is-invalid': state.isTouched() && state.getValidationState().isInvalid(),
        'is-conflict': state.isConflict(),
    };
}
