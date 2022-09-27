/* eslint-disable relay/must-colocate-fragment-spreads */
/* eslint-disable no-undef */

const QueryApp = graphql`
  query QueryAppQuery($userId: String) {
    user(id: $userId) {
      ...TodoApp_user
    }
  }
`;

export default QueryApp;
