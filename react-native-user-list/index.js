import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux';

import App from './App';
import store from './src/redux/store';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
function Root() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

registerRootComponent(Root);
