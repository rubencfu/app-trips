import { invariant, Serializable, ValueObject } from '@building-blocks/domain';

import { TripFilters, TripSortByOptions } from '@domain/models';

import { NonEmptyString } from '.';
import { PositiveNumber } from '.';

interface TripFiltersProps {
  sortBy: TripSortByOptions;
  sortOrder: 'ASC' | 'DESC';
  titleFilter: NonEmptyString;
  minPrice: PositiveNumber;
  maxPrice: PositiveNumber;
  minRating: PositiveNumber;
  tags: NonEmptyString;
  page: PositiveNumber;
  limit: PositiveNumber;
}

export class TripFiltersVO
  extends ValueObject<Partial<TripFiltersProps>>
  implements Serializable<Partial<TripFilters>>
{
  private declare unique: void;

  constructor(props: Partial<TripFiltersProps>) {
    super(props);

    if (props.sortBy) {
      invariant(
        'sortBy should be title, price, rating or creationDate',
        ['price', 'title', 'rating', 'creationDate'].includes(props.sortBy)
      );
    }

    if (props.sortOrder) {
      invariant('sortOrder should be ASC or DESC', ['ASC', 'DESC'].includes(props.sortOrder));
    }

    //If there is max tags or some tag related validation, it could be done here
  }

  toPrimitives(): Partial<TripFilters> {
    return {
      limit: this.props.limit?.toPrimitives(),
      maxPrice: this.props.maxPrice?.toPrimitives(),
      minPrice: this.props.minPrice?.toPrimitives(),
      minRating: this.props.minRating?.toPrimitives(),
      page: this.props.page?.toPrimitives(),
      sortBy: this.props.sortBy,
      sortOrder: this.props.sortOrder,
      tags: this.props.tags?.toPrimitives(),
      titleFilter: this.props.titleFilter?.toPrimitives(),
    };
  }
}
