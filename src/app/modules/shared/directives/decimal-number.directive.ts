import { NgControl } from '@angular/forms';
import { HostListener, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    exportAs: 'decimal-number-directive',
    selector: 'decimalNumber, [decimalNumber]',
})
export class DecimalNumberDirective {
    @Input('numberOfDecimals') numberOfDecimals: number;

    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-'];

    constructor(private el: ElementRef) { }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {

        var regExpString = "^[0-9]*$";
        if (this.numberOfDecimals > 0) {
            var regExpString =
                "^\\s*((\\d+(\\.\\d{0," +
                this.numberOfDecimals +
                "})?)|((\\d*(\\.\\d{1," +
                this.numberOfDecimals +
                "}))))\\s*$";
        }

        const regex: RegExp = new RegExp(regExpString);

        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
        if (next && !String(next).match(regex)) {
            event.preventDefault();
        }
    }
}