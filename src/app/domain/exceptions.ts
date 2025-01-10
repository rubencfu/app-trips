import { Exception } from '@building-blocks/domain';

export class NotFoundError extends Exception {
  constructor() {
    super(`There are no results: 404`);
  }
}
