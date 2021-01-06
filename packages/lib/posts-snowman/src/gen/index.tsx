import { Zipper } from "fp-ts-contrib/Zipper";
import * as Z from "fp-ts-contrib/Zipper";
import { AlphaLetter } from "./AlphaLetter";
import * as StateMachine from "./state-machine";
import * as Countdown from "./Countdown";
import { match } from "ts-pattern";
import * as S from "fp-ts/Set";

// Transitions

export const trans = {
  states: ["Setup", "Playing", "Won", "Lost"],
  actions: {
    Start: { from: ["Setup"], to: ["Playing"] },
    GuessWord: { from: ["Playing"], to: ["Playing", "Won", "Lost"] },
    GuessLetter: { from: ["Playing"], to: ["Playing", "Won", "Lost"] },
    Reset: { from: ["Playing", "Won", "Lost"], to: ["Setup"] },
  },
} as const;

type Trans = StateMachine.MkTrans<typeof trans>;

// States & State

const states = {
  Setup: ["roundsLeft", "words"],
  Playing: ["roundsLeft", "words", "tries", "discWord"],
  Won: ["roundsLeft", "words", "tries"],
  Lost: ["words", "tries"],
} as const;

type States = StateMachine.MkStates<Trans, Slices, typeof states>;

type State = StateMachine.UnionFromObj<States>;

// Actions & Action

type Actions = StateMachine.MkActions<
  Trans,
  Slices,
  {
    Start: [];
    GuessWord: ["word"];
    GuessLetter: ["letter"];
    Reset: [];
  }
>;

type Action = StateMachine.UnionFromObj<Actions>;

// Slices

type Slices = {
  words: Zipper<Word>;
  roundsLeft: { max: number; left: number };
  letter: AlphaLetter;
  discWord: Array<DiscAlphaLetter>;
  word: Word;
  tries: Set<AlphaLetter>;
};

// Shorthands

type Word = AlphaLetter[];

type DiscAlphaLetter = { letter: AlphaLetter; disc: boolean };

type DiscWord = DiscAlphaLetter[];

// Transition Functions

type TransTypes = StateMachine.TransTypes<Trans, States, Actions>;

const match_ = <B, _ = any>() => <A, _ = any>(value: A) => match<A, B>(value);

const transFn: StateMachine.TransFns<Trans, States, Actions> = {
  Start: () => ({ words, roundsLeft }) => ({
    tag: "Playing",
    words,
    discWord: [],
    tries: S.empty,
    roundsLeft,
  }),

  GuessWord: ({ word }) => ({ words, tries, roundsLeft }) =>
    match_<TransTypes["GuessWord"]["to"]>()({
      isMatch: word === Z.extract(words),
    })
      .with({ isMatch: true }, ({}) => ({
        tag: "Won" as const,
        roundsLeft,
        words,
        tries,
      }))
      .with({ isMatch: false }, ({}) => ({
        tag: "Lost" as const,
        words,
        tries,
      }))
      .run(),

  GuessLetter: () => (st) => st as any,

  Reset: () => (st) => st as any,
};

