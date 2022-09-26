// @flow
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import AddTodoMutation, {mutation} from '../mutations/AddTodoMutation';
import TodoList from './TodoList';
import TodoListFooter from './TodoListFooter';
import TodoTextInput from './TodoTextInput';

import React from 'react';
import {graphql} from 'react-relay';
import type {RelayProp} from 'react-relay';
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
  const { data: user, refetch} = useRefetchable(fragmentSpec, props.user);
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
            placeholder="What needs to be done?"
          />
        </header>

        <TodoList user={user} refetch={refetch} />
      </section>

      <button onClick={props.retry} className="refetch">
        Retry
      </button>

      <footer className="info">
        <p>Double-click to edit a todo</p>
      </footer>
    </div>
  );
};

export default TodoApp;
