type Tagged<T> = { [key in keyof T]: { tag: key } & T[key] };

type UnionFromTuple<T extends unknown[]> = T[number];

export type UnionFromObj<T> = T[keyof T];

type PayloadOf<T> = Omit<T, "tag">;

type Trans = {
  states: any[];
  actions: Record<any, { from: any[]; to: any[] }>;
};

type States<trans extends Trans> = Record<UnionFromTuple<trans["states"]>, any>;

type Actions<trans extends Trans> = Record<keyof trans["actions"], any>;

export type MkTrans<T> = CleanConst<T>;

type CleanConst<T> = {
  -readonly [P in keyof T]: CleanConst<T[P]>;
};

export type MkStates<trans extends Trans, slices, states> = {
  [key in keyof states]: Aux<slices, CleanConst<states>[key]>;
};

type Aux<lookup, keys> = keys extends [infer head, ...infer tail]
  ? lookup extends Record<head & string, unknown>
    ? lookup[head & string] & Aux<lookup, tail>
    : never
  : never;

export type MkActions<
  trans extends Trans,
  actions extends Actions<trans>
> = Tagged<actions>;

export type TransFns<
  trans extends Trans,
  states extends States<trans>,
  actions extends Actions<trans>
> = {
  [key in keyof actions]: (
    action: PayloadOf<actions[key]>
  ) => (
    state: states[UnionFromTuple<trans["actions"][key]["from"]>]
  ) => states[UnionFromTuple<trans["actions"][key]["to"]>];
};

