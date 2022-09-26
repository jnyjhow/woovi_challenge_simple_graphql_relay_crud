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

import ChangeTodoStatusMutation, {
  mutation as mutationChange,
} from '../mutations/ChangeTodoStatusMutation';
import RemoveTodoMutation, {
  mutation as mutationRemove,
} from '../mutations/RemoveTodoMutation';
import RenameTodoMutation, {
  mutation as mutationRename,
} from '../mutations/RenameTodoMutation';
import TodoTextInput from './TodoTextInput';

import React, {useState} from 'react';
import {createFragmentContainer, graphql, type RelayProp} from 'react-relay';
import {useFragment, useMutation} from 'relay-hooks';
import classnames from 'classnames';
import type {Todo_todo} from 'relay/Todo_todo.graphql';
import type {Todo_user} from 'relay/Todo_user.graphql';

type Props = {|
  +relay: RelayProp,
  +todo: Todo_todo,
  +user: Todo_user,
|};

const fragmentSpecTodo = graphql`
  fragment Todo_todo on Todo {
    complete
    id
    text
  }
`;
const fragmentSpecUser = graphql`
  fragment Todo_user on User {
    id
    userId
    totalCount
    completedCount
  }
`;

const Todo = props => {
  const user = useFragment(fragmentSpecUser, props.user);
  console.log('props.todo', props.todo);
  //const todo = useFragment(fragmentSpecTodo, props.todo);
  const {todo} = props;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [mutateChange] = useMutation(mutationChange);
  const [mutateRename] = useMutation(mutationRename);
  const [mutateRemove] = useMutation(mutationRemove);

  const handleCompleteChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const complete = e.currentTarget.checked;
    ChangeTodoStatusMutation.commit(mutateChange, complete, todo, user);
  };

  const handleDestroyClick = () => removeTodo();
  const handleLabelDoubleClick = () => setIsEditing(true);
  const handleTextInputCancel = () => setIsEditing(false);

  const handleTextInputDelete = () => {
    setIsEditing(false);
    removeTodo();
  };

  const handleTextInputSave = (text: string) => {
    setIsEditing(false);
    RenameTodoMutation.commit(mutateRename, text, todo);
  };

  const removeTodo = () => RemoveTodoMutation.commit(mutateRemove, todo, user);

  return (
    <li
      className={classnames({
        completed: todo.complete,
        editing: isEditing,
      })}>
      <div className="view">
        <input
          checked={todo.complete}
          className="toggle"
          onChange={handleCompleteChange}
          type="checkbox"
        />

        <label onDoubleClick={handleLabelDoubleClick}>{todo.text}</label>
        <button className="destroy" onClick={handleDestroyClick} />
      </div>

      {isEditing && (
        <TodoTextInput
          className="edit"
          commitOnBlur={true}
          initialValue={todo.text}
          onCancel={handleTextInputCancel}
          onDelete={handleTextInputDelete}
          onSave={handleTextInputSave}
        />
      )}
    </li>
  );
};

export default Todo;
