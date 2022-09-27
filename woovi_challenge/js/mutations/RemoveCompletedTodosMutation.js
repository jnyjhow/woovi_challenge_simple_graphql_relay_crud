/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable no-unused-vars */
/* eslint-disable flowtype/newline-after-flow-annotation */
// @flow

import {
  graphql,
  type Disposable,
  type Environment,
  type RecordSourceSelectorProxy,
} from 'react-relay';
import {useMutation} from 'relay-hooks';

import {ConnectionHandler} from 'relay-runtime';
import type {RemoveCompletedTodosInput} from 'relay/RemoveCompletedTodosMutation.graphql';

import type {TodoListFooter_user} from 'relay/TodoListFooter_user.graphql';

type Todos = $NonMaybeType<$ElementType<TodoListFooter_user, 'todos'>>;
type Edges = $NonMaybeType<$ElementType<Todos, 'edges'>>;
type Edge = $NonMaybeType<$ElementType<Edges, number>>;
type Node = $NonMaybeType<$ElementType<Edge, 'node'>>;

export const mutation = graphql`
  mutation RemoveCompletedTodosMutation($input: RemoveCompletedTodosInput!) {
    removeCompletedTodos(input: $input) {
      deletedTodoIds
      user {
        completedCount
        totalCount
      }
    }
  }
`;

function sharedUpdater(
  store: RecordSourceSelectorProxy,
  user: TodoListFooter_user,
  deletedIDs: $ReadOnlyArray<string>,
) {
  const userProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(userProxy, 'TodoList_todos');

  // Purposefully type forEach as void, to toss the result of deleteNode
  deletedIDs.forEach((deletedID: string): void =>
    ConnectionHandler.deleteNode(conn, deletedID),
  );
}

function commit(mutate, todos: Todos, user: TodoListFooter_user): Disposable {
  const input: RemoveCompletedTodosInput = {
    userId: user.userId,
  };

  return mutate({
    variables: {
      input,
    },
    updater: (store: RecordSourceSelectorProxy) => {
      const payload = store.getRootField('removeCompletedTodos');
      const deletedIds = payload.getValue('deletedTodoIds');

      // $FlowFixMe `payload.getValue` returns mixed, not sure how to check refinement to $ReadOnlyArray<string>
      sharedUpdater(store, user, deletedIds);
    },
    optimisticUpdater: (store: RecordSourceSelectorProxy) => {
      // Relay returns Maybe types a lot of times in a connection that we need to cater for
      const completedNodeIds: $ReadOnlyArray<string> = todos.edges
        ? todos.edges
            .filter(Boolean)
            .map((edge: Edge): ?Node => edge.node)
            .filter(Boolean)
            .filter((node: Node): boolean => node.complete)
            .map((node: Node): string => node.id)
        : [];

      sharedUpdater(store, user, completedNodeIds);
    },
  });
}

export default {commit};
