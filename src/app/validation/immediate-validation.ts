export type ImmediateValidator<T> = (t: T) => boolean;

export class ImmediateValidation<T> {
    constructor(
        readonly key: string,
        readonly validate: ImmediateValidator<T>) {
    }

    withKey(newKey: string) {
        return new ImmediateValidation<T>(newKey, this.validate);
    }
}
