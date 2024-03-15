import { AbstractControl, ValidatorFn } from '@angular/forms';

export function ValidateRut(control: AbstractControl) {
    if (!validate(control.value)) {
        return { validRut: true };
    }
    return false;
}

export function validate(rut) {
    if (typeof rut !== 'string') {
        return false;
    }
    if (rut === '') {
        return true;
    }

    if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut)) {
        return false;
    }
    rut = clean(rut);
    let t = parseInt(rut.slice(0, -1), 10);
    let m = 0;
    let s = 1;

    while (t > 0) {
        s = (s + (t % 10) * (9 - m++ % 6)) % 11;
        t = Math.floor(t / 10);
    }

    const v = s > 0 ? '' + (s - 1) : 'K';
    return v === rut.slice(-1);
}

function clean(rut) {
    return typeof rut === 'string'
        ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
        : '';
}
