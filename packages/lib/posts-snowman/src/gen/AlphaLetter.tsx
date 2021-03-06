export type AlphaLetter = string & { readonly brand: unique symbol };

const alphaLetters: NonEmptyArray<string> = ["A", "B", "C"];

const pred = (str: string): str is AlphaLetter =>
  A.elem(eqString)(str)(alphaLetters);

export const mkAlphaLetter = O.fromPredicate(pred);

export const genAlphaLetter: IO<AlphaLetter> = pipe(
  alphaLetters,
  NEA.map(I.of),
  RandUtil.oneof,
  I.map(flow(mkAlphaLetter, O.getOrElse(RandUtil.never)))
);

