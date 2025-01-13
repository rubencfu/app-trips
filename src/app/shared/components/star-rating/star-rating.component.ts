import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating-container relative flex gap-1.5 items-center text-yellow-500">
      <!-- We draw 5 stars using a loop -->
      @for (index of [0, 1, 2, 3, 4]; track $index) {
        <div class="star-container">
          <img
            class="star"
            [width]="starSize()"
            [height]="starSize()"
            alt="star icon"
            [src]="
              rating() === index + 0.5 ? halfStar : rating() > index + 0.5 ? fullStar : emptyStar
            "
          />
        </div>
      }
      <span class="text-center">{{ rating() | number: '1.0-2' }}</span>
    </div>
  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRatingComponent {
  rating = input<number>(0);
  // We can customize the size to show the stars
  starSize = input<number>(28);

  protected readonly fullStar = 'icons/star.svg';
  protected readonly halfStar = 'icons/half-star.svg';
  protected readonly emptyStar = 'icons/empty-star.svg';

  // This component can be modified to be converted into an input for star rating based on clicks
}
