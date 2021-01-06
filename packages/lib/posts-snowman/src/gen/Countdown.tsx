import { pipe } from "fp-ts/function";

export type Countdown = {
  max: bigint;
  left: bigint;
  readonly brand: unique symbol;
};

export const init = (n: bigint): Countdown =>
  ({ max: n, left: n } as Countdown);

export const down = ({ max, left }: Countdown): Countdown =>
  ({
    max,
    left: pipe(Math.max(0, Number(left) - 1), BigInt),
  } as Countdown);

export const reset = ({ max }: Countdown): Countdown => init(max);

export const eq = (c1: Countdown, c2: Countdown): boolean =>
  c1.max === c2.max && c1.left === c2.left;

