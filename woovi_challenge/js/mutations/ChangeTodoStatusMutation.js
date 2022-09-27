/* eslint-disable no-unused-vars */
/* eslint-disable flowtype/newline-after-flow-annotation */
// @flow

import {graphql, type Disposable, type Environment} from 'react-relay';
import {useMutation} from 'relay-hooks';
import type {Todo_todo} from 'relay/Todo_todo.graphql';
import type {Todo_user} from 'relay/Todo_user.graphql';
import type {
  ChangeTodoStatusInput,
  ChangeTodoStatusMutationResponse,
} from 'relay/ChangeTodoStatusMutation.graphql';

export const mutation = graphql`
  mutation ChangeTodoStatusMutation($input: ChangeTodoStatusInput!) {
    changeTodoStatus(input: $input) {
      todo {
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
  todo: Todo_todo,
  user: Todo_user,
): ChangeTodoStatusMutationResponse {
  return {
    changeTodoStatus: {
      todo: {
        complete: complete,
        id: todo.id,
      },
      user: {
        id: user.id,
        completedCount: complete
          ? user.completedCount + 1
          : user.completedCount - 1,
      },
    },
  };
}

function commit(
  mutate,
  complete: boolean,
  todo: Todo_todo,
  user: Todo_user,
): Disposable {
  const input: ChangeTodoStatusInput = {
    complete,
    userId: user.userId,
    id: todo.id,
  };

  return mutate({
    variables: {
      input,
    },
    optimisticResponse: getOptimisticResponse(complete, todo, user),
  });
}

export default {commit};
