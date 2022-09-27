/* eslint-disable no-unused-vars */
/* eslint-disable flowtype/newline-after-flow-annotation */
// @flow

import {
  graphql,
  type Disposable,
  type Environment,
  type RecordProxy,
  type RecordSourceSelectorProxy,
} from 'react-relay';

import {ConnectionHandler} from 'relay-runtime';
import type {TodoApp_user} from 'relay/TodoApp_user.graphql';
import type {AddTodoInput} from 'relay/AddTodoMutation.graphql';

export const mutation = graphql`
  mutation AddTodoMutation($input: AddTodoInput!) {
    addTodo(input: $input) {
      todoEdge {
        __typename
        cursor
        node {
          complete
          id
          text
        }
      }
      user {
        id
        totalCount
      }
    }
  }
`;

function sharedUpdater(
  store: RecordSourceSelectorProxy,
  user: TodoApp_user,
  newEdge: RecordProxy,
) {
  const userProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(userProxy, 'TodoList_todos');
  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

let tempID = 0;

function commit(mutate, text: string, user: TodoApp_user): Disposable {
  const input: AddTodoInput = {
    text,
    userId: user.userId,
    clientMutationId: `${tempID++}`,
  };

  return mutate({
    variables: {
      input,
    },
    updater: (store: RecordSourceSelectorProxy) => {
      const payload = store.getRootField('addTodo');
      const newEdge = payload.getLinkedRecord('todoEdge');
      sharedUpdater(store, user, newEdge);
    },
    optimisticUpdater: (store: RecordSourceSelectorProxy) => {
      const id = 'client:newTodo:' + tempID++;
      const node = store.create(id, 'Todo');
      node.setValue(text, 'text');
      node.setValue(id, 'id');

      const newEdge = store.create('client:newEdge:' + tempID++, 'TodoEdge');
      newEdge.setLinkedRecord(node, 'node');
      sharedUpdater(store, user, newEdge);

      // Get the UserProxy, and update the totalCount
      const userProxy = store.get(user.id);

      if (!userProxy) {
        throw new Error('Failed to retrieve userProxy from store');
      }

      const totalCount = userProxy.getValue('totalCount');

      if (typeof totalCount !== 'number') {
        throw new Error(
          `Expected userProxy.totalCount to be number, but got: ${typeof totalCount}`,
        );
      }

      userProxy.setValue(totalCount + 1, 'totalCount');
    },
  });
}

export default {commit};
