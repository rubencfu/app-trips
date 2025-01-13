import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[clickOutside]',
  standalone: true,
  host: {
    '(document:click)': 'onClick($event.target)',
  },
})
export class ClickOutsideDirective {
  clickOutside = output<void>();

  private elementRef = inject(ElementRef);

  public onClick(target: EventTarget) {
    const clickedInside = this.elementRef.nativeElement.contains(target);

    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}
