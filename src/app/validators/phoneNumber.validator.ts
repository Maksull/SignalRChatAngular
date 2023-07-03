import { AbstractControl } from "@angular/forms";

export function phoneNumberValidator(control: AbstractControl): { [key: string]: any } | null {
    const phoneNumberRegex = /^\d{10}$/;

    return phoneNumberRegex.test(control.value) ? null : { invalidPhoneNumber: true };
}