import { Zipper } from "fp-ts-contrib/Zipper";
import { AlphaLetter } from "./AlphaLetter";
import * as StateMachine from "./state-machine";
import * as TypeUtils from "./type-utils";

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
  Lost: ["roundsLeft", "words", "tries"],
} as const;

type States = StateMachine.MkStates<Trans, Slices, typeof states>;

type State = StateMachine.UnionFromObj<States>;

// Actions & Action

type Actions = StateMachine.MkActions<
  Trans,
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

