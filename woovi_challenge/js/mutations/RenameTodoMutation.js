/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable no-unused-vars */
/* eslint-disable flowtype/newline-after-flow-annotation */
// @flow

import {graphql, type Disposable, type Environment} from 'react-relay';
import {useMutation} from 'relay-hooks';

import type {Todo_todo} from 'relay/Todo_todo.graphql';

import type {
  RenameTodoInput,
  RenameTodoMutationResponse,
} from 'relay/RenameTodoMutation.graphql';

export const mutation = graphql`
  mutation RenameTodoMutation($input: RenameTodoInput!) {
    renameTodo(input: $input) {
      todo {
        id
        text
      }
    }
  }
`;

function getOptimisticResponse(
  text: string,
  todo: Todo_todo,
): RenameTodoMutationResponse {
  return {
    renameTodo: {
      todo: {
        id: todo.id,
        text: text,
      },
    },
  };
}

function commit(mutate, text: string, todo: Todo_todo): Disposable {
  const input: RenameTodoInput = {
    text,
    id: todo.id,
  };

  return mutate({
    variables: {
      input,
    },
    optimisticResponse: getOptimisticResponse(text, todo),
  });
}

export default {commit};
