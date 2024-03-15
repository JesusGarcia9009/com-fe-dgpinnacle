import { NgControl } from '@angular/forms';
import { HostListener, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    exportAs: 'rut-formater-directive',
    selector: 'rutFormater, [rutFormater]',
})
export class RutFormaterDirective {

    constructor(private el: ElementRef, private renderer: Renderer2) { }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {

        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
        const formatedRut = this.format(current);
       

        let finalValue = formatedRut;

        if (formatedRut === '-1') {
            finalValue = next;
        }

        // this.el.nativeElement.value = finalValue;
        this.renderer.setProperty(this.el.nativeElement,'value', finalValue);

        // if (next && !String(next).match(regex)) {
        //     event.preventDefault();
        // }
    }


    format(rut) {
        rut = this.clean(rut)

        let result = rut.slice(-4, -1) + '-' + rut.substr(rut.length - 1)
        for (let i = 4; i < rut.length; i += 3) {
            result = rut.slice(-3 - i, -i) + '.' + result
        }

        return result
    }

    clean(rut) {
        return typeof rut === 'string'
            ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
            : ''
    }
}