/* eslint-disable no-unused-vars */
/* eslint-disable flowtype/newline-after-flow-annotation */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable relay/generated-flow-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// @flow

import MarkAllTodosMutation, {
  mutation,
} from '../mutations/MarkAllTodosMutation';
import Todo from './Todo';

import React from 'react';
import {createFragmentContainer, graphql, type RelayProp} from 'react-relay';
import QueryApp from '../query/QueryApp';
import type {TodoList_user} from 'relay/TodoList_user.graphql';
import {useFragment, useMutation} from 'relay-hooks';

type Todos = $NonMaybeType<$ElementType<TodoList_user, 'todos'>>;
type Edges = $NonMaybeType<$ElementType<Todos, 'edges'>>;
type Edge = $NonMaybeType<$ElementType<Edges, number>>;
type Node = $NonMaybeType<$ElementType<Edge, 'node'>>;

type Props = {|
  +relay: RelayProp,
  +user: TodoList_user,
|};

const fragmentSpec = graphql`
  fragment TodoList_user on User {
    todos(
      first: 2147483647 # max GraphQLInt
    ) @connection(key: "TodoList_todos") {
      edges {
        ...TodoList_edges
      }
    }
    id
    userId
    totalCount
    completedCount
    ...Todo_user
  }
`;

const fragmentSpecList = graphql`
  fragment TodoList_edges on TodoEdge @relay(plural: true) {
    node {
      complete
      id
      text
    }
  }
`;

const TodoList = props => {
  const {refetch} = props;
  //const { refetch } = props;
  const user = useFragment(fragmentSpec, props.user);
  const {todos, completedCount, totalCount, userId} = user;
  console.log('todos', todos);

  const edges = useFragment(fragmentSpecList, todos.edges);

  console.log('edges', edges);
  const [mutate] = useMutation(mutation);
  const handleMarkAllChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const complete = e.currentTarget.checked;

    if (todos) {
      MarkAllTodosMutation.commit(mutate, complete, todos, user);
    }
  };

  const handlerRefetch = () => {
    const response = refetch({});
    //response.dispose();
  };

  const nodes: $ReadOnlyArray<Node> = edges
    ? edges
        .filter(Boolean)
        .map((edge: Edge) => edge.node)
        .filter(Boolean)
    : [];
  return (
    <section className="main">
      <input
        checked={totalCount === completedCount}
        className="toggle-all"
        onChange={handleMarkAllChange}
        type="checkbox"
      />

      <label htmlFor="toggle-all">Mark all as complete</label>

      <ul className="todo-list">
        {nodes.map((node: Node) => (
          <Todo key={node.id} todo={node} user={user} />
        ))}
      </ul>
      <button onClick={handlerRefetch} className="refetch">
        Refetch
      </button>
    </section>
  );
};
export default TodoList;
