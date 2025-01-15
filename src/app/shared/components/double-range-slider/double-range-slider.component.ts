import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  LOCALE_ID,
  OnInit,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

/* Simple custom double range slider for min and max prices... We can use third party libraries, 
   but that would highly increase bundle size and we would have less control.
   Using custom components is slower to code, but better at long term for scalability and maintenance */
@Component({
  selector: 'app-double-range-slider',
  template: ` <div class="wrapper relative">
    <div
      class="values text-xl text-white font-medium text-center rounded-md py-1.5 w-3/4 relative m-auto bg-primary"
    >
      <span id="rangeMin">
        {{ value.min | currency: localeCurrencies[locale] : 'symbol' : '1.0-0' }}
      </span>
      <span> - </span>
      <span id="rangeMax">
        {{ value.max | currency: localeCurrencies[locale] : 'symbol' : '1.0-0' }}</span
      >
    </div>
    <div class="container relative w-full h-20">
      <div
        [style.background]="sliderBackground"
        class="slider-track bg-primary w-full h-1.5 absolute m-auto top-0 bottom-0 rounded-md "
      ></div>
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [formControl]="minInput"
        aria-label="min value slider"
        id="minSlider"
        (change)="slideOne()"
        (input)="fillColor()"
        class="appearance-none w-full outline-none absolute m-auto top-0 bottom-0 bg-transparent pointer-events-none"
      />
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [formControl]="maxInput"
        id="maxSlider"
        aria-label="max value slider"
        class="appearance-none w-full outline-none absolute m-auto top-0 bottom-0 bg-transparent pointer-events-none"
        (change)="slideTwo()"
        (input)="fillColor()"
      />
    </div>
  </div>`,
  imports: [CommonModule, ReactiveFormsModule],
  styles: `
    input[type='range']::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      height: 5px;
    }
    input[type='range']::-moz-range-track {
      -moz-appearance: none;
      height: 5px;
    }
    input[type='range']::-ms-track {
      appearance: none;
      height: 5px;
    }
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 1.4em;
      width: 1.4em;
      background-color: #10a1b3;
      cursor: pointer;
      margin-top: -9px;
      pointer-events: auto;
      border-radius: 50%;
    }
    input[type='range']::-moz-range-thumb {
      -webkit-appearance: none;
      height: 1.4em;
      width: 1.4em;
      cursor: pointer;
      border-radius: 50%;
      background-color: #10a1b3;
      pointer-events: auto;
      border: none;
    }
    input[type='range']::-ms-thumb {
      appearance: none;
      height: 1.4em;
      width: 1.4em;
      cursor: pointer;
      border-radius: 50%;
      background-color: #10a1b3;
      pointer-events: auto;
    }
    input[type='range']:active::-webkit-slider-thumb {
      background-color: #ffffff;
      border: 1px solid #10a1b3;
    }
    .values:before {
      content: '';
      position: absolute;
      height: 0;
      width: 0;
      border-top: 15px solid #10a1b3;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      margin: auto;
      bottom: -14px;
      left: 0;
      right: 0;
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DoubleRangeSliderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoubleRangeSliderComponent implements ControlValueAccessor, OnInit {
  min = input<number>(0);
  max = input<number>(100);

  value: { min: number; max: number } = { min: 0, max: 100 };

  minInput = new FormControl<number>(0, { nonNullable: true });
  maxInput = new FormControl<number>(100, { nonNullable: true });

  disabled = false;

  protected readonly localeCurrencies: Record<string, string> = {
    'en-Us': 'USD',
    es: 'EUR',
  };

  protected onTouched = () => {};
  protected onChange = (value: { min: number; max: number }) => {};

  protected sliderBackground = '';

  protected readonly locale = inject(LOCALE_ID);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.slideOne();
    this.slideTwo();
  }

  slideOne() {
    if (this.maxInput.value - this.minInput.value <= 0) {
      this.minInput.patchValue(this.maxInput.value);
    }

    this.setValue({ min: this.minInput.value, max: this.maxInput.value });
    this.fillColor();
  }

  slideTwo() {
    if (this.maxInput.value - this.minInput.value <= 0) {
      this.maxInput.patchValue(this.minInput.value);
    }

    this.setValue({ min: this.minInput.value, max: this.maxInput.value });
    this.fillColor();
  }

  fillColor() {
    const percent1 = (this.minInput.value / this.max()) * 100;
    const percent2 = (this.maxInput.value / this.max()) * 100;
    this.sliderBackground = `linear-gradient(to right, #dadae5 ${percent1}% , #10a1b3 ${percent1}% , #10a1b3 ${percent2}%, #dadae5 ${percent2}%)`;
  }

  setValue(value: { min: number; max: number }) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: { min: number; max: number }) {
    this.value = value;
    this.minInput.setValue(value.min);
    this.maxInput.setValue(value.max);
    this.fillColor();
    this.cdr.detectChanges();
  }

  registerOnChange(onChange: (value: { min: number; max: number }) => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}
