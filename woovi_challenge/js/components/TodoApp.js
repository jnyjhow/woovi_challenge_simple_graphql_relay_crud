/* eslint-disable no-unused-vars */
/* eslint-disable flowtype/newline-after-flow-annotation */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable relay/generated-flow-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @flow

import AddTodoMutation, {mutation} from '../mutations/AddTodoMutation';
import TodoList from './TodoList';
import TodoListFooter from './TodoListFooter';
import TodoTextInput from './TodoTextInput';

import React from 'react';
import {createFragmentContainer, graphql, type RelayProp} from 'react-relay';
import {useRefetchable, useMutation} from 'relay-hooks';
import type {TodoApp_user} from 'relay/TodoApp_user.graphql';

type Props = {|
  +relay: RelayProp,
  +user: TodoApp_user,
|};

const fragmentSpec = graphql`
  fragment TodoApp_user on User
    @refetchable(queryName: "UserFragmentRefetchTableQuery") {
    id
    userId
    totalCount
    ...TodoListFooter_user
    ...TodoList_user
  }
`;

const TodoApp = props => {
  const {data: user, refetch} = useRefetchable(fragmentSpec, props.user);
  const [mutate, {loading}] = useMutation(mutation);
  const handleTextInputSave = (text: string) => {
    AddTodoMutation.commit(mutate, text, user);
    return;
  };

  const hasTodos = user.totalCount > 0;

  return (
    <div>
      <section className="todoapp">
        <header className="header">
          <h1>todos {props.userId}</h1>

          <TodoTextInput
            className="new-todo"
            onSave={handleTextInputSave}
            placeholder="What needs to be done???"
          />
        </header>

        <TodoList user={user} refetch={refetch} />
      </section>

      <button onClick={props.retry} className="refetch">
        Retry
      </button>

      <footer className="info">
        <h1>
          <p>Double-click to edit a todo</p>
        </h1>
      </footer>
    </div>
  );
};

export default TodoApp;
