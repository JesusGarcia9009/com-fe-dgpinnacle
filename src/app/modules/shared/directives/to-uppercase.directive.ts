import { Directive,HostListener } from '@angular/core';

@Directive({
  selector: '[appToUpperCase]'
})
export class ToUpperCaseDirective {

  constructor() { }

  @HostListener('keydown', ['$event']) onKeyDown(event:KeyboardEvent) {
    if (event.keyCode>32 && event.keyCode<128)
   {
      event.target['value']+=event.key.toUpperCase();
      event.preventDefault(); //stop propagation
      //must create a "input" event, if not, there are no change in your value
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("input", false, true);
      event.target.dispatchEvent(evt);
    }

  }

}