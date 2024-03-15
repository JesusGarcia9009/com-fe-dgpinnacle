import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'rutFormat'
})
export class RutFormatPipe implements PipeTransform {
    transform(value: string): string {
        return this.format(value);
    }

    format(rut) {
        rut = this.clean(rut)

        let result = rut.slice(-4, -1) + '-' + rut.substr(rut.length - 1)
        for (let i = 4; i < rut.length; i += 3) {
            result = rut.slice(-3 - i, -i) + '.' + result
        }

        if (result === '-') result = "";
        return result
    }

    clean(rut) {
        return typeof rut === 'string'
            ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
            : ''
    }

}