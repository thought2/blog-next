import { IO } from "fp-ts/IO";
import * as I from "fp-ts/IO";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as Ra from "fp-ts/Random";
import { NonEmptyArray } from "fp-ts/NonEmptyArray";
import { pipe } from "fp-ts/function";

export const never = (): any => {
  throw new Error("Never");
};
export const oneof = <T, _>(xs: NonEmptyArray<IO<T>>): IO<T> =>
  pipe(
    Ra.randomInt(0, xs.length - 1),
    I.chain((n) => pipe(A.lookup(n)(xs), O.getOrElse(never)))
  );

export const arrayOf = (min: number, max: number) => <T, _>(
  gen: IO<T>
): IO<Array<T>> =>
  pipe(
    Ra.randomInt(min, max),
    I.map((n) => pipe(A.replicate(n, gen), A.sequence(I.io))),
    I.flatten
  );

