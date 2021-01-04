import * as React from "react";

import {
  RecursivePartial,
  NodeOptions,
  EdgeOptions,
  DagreReact,
} from "dagre-reactjs";
import { pipe } from "fp-ts/lib/function";
import { record as R, array as A } from "fp-ts";

const DEFAULT_NODE_CONFIG = {
  styles: {
    node: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
    shape: {
      styles: { fill: "#845" },
    },
  },
};

const DEFAULT_EDGE_CONFIG = {
  styles: {
    edge: {
      styles: { fillOpacity: 0, stroke: "#000", strokeWidth: "1px" },
    },
  },
};

type Trans<State, Action> = {
  states: Array<State & string>;
  actions: Record<Action & string, { from: State[]; to: State[] }>;
};

const getStateNodes = <S, A>(
  trans: Trans<S, A>
): Array<RecursivePartial<NodeOptions>> =>
  pipe(
    trans.states,
    A.map((key) => ({
      id: key,
      label: key,
      shape: "circle",
      styles: { label: { styles: { fontWeight: "bold" } } },
    }))
  );

const getActionNodes = <S, A>(
  trans: Trans<S, A>
): Array<RecursivePartial<NodeOptions>> =>
  pipe(
    trans.actions,
    R.collect((key) => ({ id: key, label: key }))
  );

const getStateEdges = <S extends string, A extends string>(
  trans: Trans<S, A>
): Array<RecursivePartial<EdgeOptions>> =>
  pipe(
    trans.actions,
    R.collect((action, v) => [
      ...pipe(
        v.from,
        A.map((state) => ({
          from: state,
          to: action,
        }))
      ),
    ]),
    A.flatten
  );

const getActionEdges = <S extends string, A extends string>(
  trans: Trans<S, A>
): Array<RecursivePartial<EdgeOptions>> =>
  pipe(
    trans.actions,
    R.collect((action, v) => [
      ...pipe(
        v.to,
        A.map((state) => ({
          from: action,
          to: state,
          styles: {
            edge: {
              styles: { strokeWidth: "1px" },
            },
          },
        }))
      ),
    ]),
    A.flatten
  );

export default <S extends string, A extends string>({
  trans,
}: {
  trans: Trans<S, A>;
}) => {
  const [size, setSize] = React.useState({ width: 1000, height: 1000 });

  return (
    <svg
      id="schedule"
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        backgroundColor: "white",
        //border: "15px solid white",
      }}
    >
      <DagreReact
        nodes={[...getStateNodes(trans), ...getActionNodes(trans)]}
        edges={[...getStateEdges(trans), ...getActionEdges(trans)]}
        defaultNodeConfig={DEFAULT_NODE_CONFIG}
        defaultEdgeConfig={DEFAULT_EDGE_CONFIG}
        graphLayoutComplete={(width, height) => {
          setTimeout(() => {
            setSize({ width: width || 0, height: height || 0 });
          }, 0);
        }}
        graphOptions={{
          marginx: 50,
          marginy: 50,
          rankdir: "LR",
          ranksep: 55,
          nodesep: 15,
        }}
      />
    </svg>
  );
};
