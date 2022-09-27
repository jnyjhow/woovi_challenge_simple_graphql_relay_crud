// @flow
/* eslint-disable relay/generated-flow-types */
/* eslint-disable flowtype/require-parameter-type */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line flowtype/newline-after-flow-annotation

import * as React from 'react';
import {useState} from 'react';
//import {useLazyLoadQuery, RelayEnvironmentProvider} from 'react-relay/hooks';
import {
  useQuery,
  useLazyLoadQuery,
  RelayEnvironmentProvider,
} from 'relay-hooks';
import {
  Environment,
  Network,
  RecordSource,
  Store,
  type RequestNode,
  type Variables,
  Observable,
} from 'relay-runtime';
import TodoApp, {fragmentSpec} from './components/TodoApp';
//import { useQuery, RelayEnvironmentProvider } from 'relay-hooks';
import QueryApp from './query/QueryApp';

function fetchQuery(operation, variables) {
  return Observable.create(sink => {
    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.errors) {
          sink.error(data.errors);
          return;
        }
        sink.next(data);
        sink.complete();
      });
  });
}

const modernEnvironment: Environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

const AppTodo = function(appProps) {
  const [userId, setUserId] = useState('me');

  console.log('renderer apptodo', userId);

  const handleTextUser = (text: string) => {
    console.log('change user', text);
    setUserId(text);
    return;
  };

  return (
    <div>
      <div className="apptodo">
        <h2>---------- who is the user? ----------</h2>
        <div id="radioGroup">
          <div className="wrap">
            <input
              type="radio"
              name="user"
              id="userMe"
              value="me"
              checked={userId === 'me'}
              onChange={() => handleTextUser('me')}
            />
            <label htmlFor="userMe">Me</label>
          </div>

          <div className="wrap">
            <input
              type="radio"
              name="user"
              id="userYou"
              value="you"
              checked={userId === 'you'}
              onChange={() => handleTextUser('you')}
            />
            <label htmlFor="userYou">You</label>
          </div>
        </div>
      </div>
      <LayoutTodo userId={userId} />
    </div>
  );
};
const isServer = typeof window === 'undefined';
const skip = isServer;
const LayoutTodo = ({userId}) => {
  console.log('LayoutTodo', userId, isServer);
  const {data, retry, error, isLoading} = useQuery(
    QueryApp,
    {userId},
    {
      fetchPolicy: 'store-or-network',
      skip,
      networkCacheConfig: {
        force: true,
        poll: isServer ? undefined : 1 * 60 * 1000,
      },
    },
  );

  console.log('loading', isLoading, skip);
  if (isLoading || skip) {
    return <div>loading</div>;
  } else if (error) {
    return (
      <div>
        {error.message}
        <button onClick={retry} className="refetch">
          Retry
        </button>
      </div>
    );
  }
  console.log('renderer', data);
  return <TodoApp user={data.user} userId={userId} retry={retry} />;
};

const App = (
  <RelayEnvironmentProvider environment={modernEnvironment}>
    <AppTodo />
  </RelayEnvironmentProvider>
);

export default App;
