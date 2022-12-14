/* eslint-disable no-unused-vars */
/* eslint-disable flowtype/newline-after-flow-annotation */
// @flow

import {
  commitMutation,
  graphql,
  type Disposable,
  type Environment,
  type RecordSourceSelectorProxy,
} from 'react-relay';
import {useMutation} from 'relay-hooks';

import {ConnectionHandler} from 'relay-runtime';

import type {Todo_user} from 'relay/Todo_user.graphql';
import type {Todo_todo} from 'relay/Todo_todo.graphql';
import type {RemoveTodoInput} from 'relay/RemoveTodoMutation.graphql';

export const mutation = graphql`
  mutation RemoveTodoMutation($input: RemoveTodoInput!) {
    removeTodo(input: $input) {
      deletedTodoId
      user {
        completedCount
        totalCount
      }
    }
  }
`;

function sharedUpdater(
  store: RecordSourceSelectorProxy,
  user: Todo_user,
  deletedID: string,
) {
  const userProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(userProxy, 'TodoList_todos');
  ConnectionHandler.deleteNode(conn, deletedID);
}

function commit(mutate, todo: Todo_todo, user: Todo_user): Disposable {
  const input: RemoveTodoInput = {
    id: todo.id,
    userId: user.userId,
  };

  return mutate({
    variables: {
      input,
    },
    updater: (store: RecordSourceSelectorProxy) => {
      const payload = store.getRootField('removeTodo');
      const deletedTodoId = payload.getValue('deletedTodoId');

      if (typeof deletedTodoId !== 'string') {
        throw new Error(
          `Expected removeTodo.deletedTodoId to be string, but got: ${typeof deletedTodoId}`,
        );
      }

      sharedUpdater(store, user, deletedTodoId);
    },
    optimisticUpdater: (store: RecordSourceSelectorProxy) => {
      sharedUpdater(store, user, todo.id);
    },
  });
}

export default {commit};
