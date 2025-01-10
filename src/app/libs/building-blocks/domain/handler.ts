export abstract class Handler<In, Out> {
  abstract handle(params: In): Out;
}
