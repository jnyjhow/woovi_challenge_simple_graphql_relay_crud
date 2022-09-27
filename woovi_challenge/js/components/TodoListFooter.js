/* eslint-disable no-unused-vars */
/* eslint-disable flowtype/newline-after-flow-annotation */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable relay/generated-flow-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @flow

import RemoveCompletedTodosMutation, {
  mutation,
} from '../mutations/RemoveCompletedTodosMutation';

import React from 'react';
import {graphql, createFragmentContainer, type RelayProp} from 'react-relay';
import type {TodoListFooter_user} from 'relay/TodoListFooter_user.graphql';

type Todos = $NonMaybeType<$ElementType<TodoListFooter_user, 'todos'>>;
type Edges = $NonMaybeType<$ElementType<Todos, 'edges'>>;
type Edge = $NonMaybeType<$ElementType<Edges, number>>;
import {useOssFragment, useMutation} from 'relay-hooks';

type Props = {|
  +relay: RelayProp,
  +user: TodoListFooter_user,
|};

const fragmentSpec = graphql`
  fragment TodoListFooter_user on User {
    id
    userId
    completedCount
    todos(
      first: 2147483647 # max GraphQLInt
    ) @connection(key: "TodoList_todos") {
      edges {
        node {
          id
          complete
        }
      }
    }
    totalCount
  }
`;

const TodoListFooter = props => {
  const [user, functions] = useOssFragment(fragmentSpec, props.user);
  const {todos, completedCount, totalCount} = user;
  const completedEdges: $ReadOnlyArray<?Edge> =
    todos && todos.edges
      ? todos.edges.filter(
          (edge: ?Edge) => edge && edge.node && edge.node.complete,
        )
      : [];

  const [mutate] = useMutation(mutation);
  const handleRemoveCompletedTodosClick = () => {
    RemoveCompletedTodosMutation.commit(
      mutate,
      {
        edges: completedEdges,
      },
      user,
    );
  };

  const numRemainingTodos = totalCount - completedCount;

  console.log('completedCount', completedCount);

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{numRemainingTodos}</strong> item
        {numRemainingTodos === 1 ? '' : 's'} left
      </span>

      {completedCount > 0 && (
        <button
          className="clear-completed"
          onClick={handleRemoveCompletedTodosClick}>
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoListFooter;
