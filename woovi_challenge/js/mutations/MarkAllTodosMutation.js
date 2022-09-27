/* eslint-disable no-unused-vars */
/* eslint-disable flowtype/newline-after-flow-annotation */
// @flow

import {
  commitMutation,
  graphql,
  type Disposable,
  type Environment,
} from 'react-relay';
import {useMutation} from 'relay-hooks';

import type {
  MarkAllTodosInput,
  MarkAllTodosMutationResponse,
} from 'relay/MarkAllTodosMutation.graphql';

type MarkAllTodos = $NonMaybeType<
  $ElementType<MarkAllTodosMutationResponse, 'markAllTodos'>,
>;
type ChangedTodos = $NonMaybeType<$ElementType<MarkAllTodos, 'changedTodos'>>;
type ChangedTodo = $ElementType<ChangedTodos, number>;

import type {TodoList_user} from 'relay/TodoList_user.graphql';

type Todos = $NonMaybeType<$ElementType<TodoList_user, 'todos'>>;
type Edges = $NonMaybeType<$ElementType<Todos, 'edges'>>;
type Edge = $NonMaybeType<$ElementType<Edges, number>>;
type Node = $NonMaybeType<$ElementType<Edge, 'node'>>;

export const mutation = graphql`
  mutation MarkAllTodosMutation($input: MarkAllTodosInput!) {
    markAllTodos(input: $input) {
      changedTodos {
        id
        complete
      }
      user {
        id
        completedCount
      }
    }
  }
`;

function getOptimisticResponse(
  complete: boolean,
  todos: Todos,
  user: TodoList_user,
): MarkAllTodosMutationResponse {
  // Relay returns Maybe types a lot of times in a connection that we need to cater for
  const validNodes: $ReadOnlyArray<Node> = todos.edges
    ? todos.edges
        .filter(Boolean)
        .map((edge: Edge): ?Node => edge.node)
        .filter(Boolean)
    : [];

  const changedTodos: ChangedTodos = validNodes
    .filter((node: Node): boolean => node.complete !== complete)
    .map((node: Node): ChangedTodo => ({
      complete: complete,
      id: node.id,
    }));

  return {
    markAllTodos: {
      changedTodos,
      user: {
        id: user.id,
        completedCount: complete ? user.totalCount : 0,
      },
    },
  };
}

function commit(
  mutate,
  complete: boolean,
  todos: Todos,
  user: TodoList_user,
): Disposable {
  const input: MarkAllTodosInput = {
    complete,
    userId: user.userId,
  };

  return mutate({
    variables: {
      input,
    },
    optimisticResponse: getOptimisticResponse(complete, todos, user),
  });
}

export default {commit};
