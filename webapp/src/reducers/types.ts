export interface PartialAction<T, Y> {
  type: T;
  payload: Partial<Y>;
}

export interface Action<T, Y> {
  type: T;
  payload: Y;
}
