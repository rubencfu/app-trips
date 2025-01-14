import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Nullish } from '@shared-kernel/types';

import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';

type DropdownItem = { label: string; value: string | number };

// Simple custom dropdown component, it can be modified and add keyboard search, tabulation, dynamic styles, etc...
@Component({
  selector: 'app-dropdown',
  template: `<div class="dropdown-container relative w-full cursor-pointer">
    <div
      (clickOutside)="close()"
      (click)="toggleDropdown()"
      class="dropdown-input hover:bg-slate-100 transition border border-primary shadow-sm py-1 px-2 rounded-md flex items-center justify-between text-base"
    >
      <span>{{ selectedLabel ?? placeholder() }}</span>
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"></path>
      </svg>
    </div>
    @if (isOpen) {
      <div
        class="dropdown-content bg-white border border-primary absolute z-10 max-h-80 overflow-auto top-11 w-full rounded-md"
      >
        @for (item of data(); track $index) {
          <div
            (click)="setValue(item)"
            [ngClass]="{ 'dropdown-selected bg-slate-100': value === item.value }"
            class="dropdown-item hover:bg-slate-100 p-2 flex justify-between transition"
          >
            <span>
              {{ item.label }}
            </span>
            @if (value === item.value) {
              <!--Check icon-->
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path
                  d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"
                ></path>
              </svg>
            }
          </div>
        }
      </div>
    }
  </div>`,
  imports: [CommonModule, ClickOutsideDirective],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DropdownComponent), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements ControlValueAccessor {
  placeholder = input<string>('Select option');
  valueManuallyChanged = output<void>();

  data = input.required<DropdownItem[]>();

  value: string | number = 'default';
  selectedLabel?: Nullish<string> = undefined;

  isOpen = false;

  disabled = false;

  protected onTouched = () => {};
  protected onChange = (value: string | number) => {};

  constructor() {
    effect(() => {
      this.selectedLabel = this.data().find((i) => i.value === this.value)?.label;
    });
  }

  setValue(item: DropdownItem) {
    this.value = item.value;
    this.selectedLabel = item.label;
    this.onChange(item.value);
    this.onTouched();
    this.valueManuallyChanged.emit();
    this.close();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }

  writeValue(value: string | number) {
    this.value = value;
    this.selectedLabel = this.data().find((i) => i.value === value)?.label;
  }

  registerOnChange(onChange: (value: string | number) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
