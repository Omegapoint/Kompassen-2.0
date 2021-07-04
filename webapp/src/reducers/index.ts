import { combineReducers, createStore } from 'redux';
import user from './user';
import session from './session';
import locations from './locations';
import categories from './categories';
import events from './events';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
  user,
  session,
  locations,
  categories,
  events,
});

const store = createStore(rootReducer);

export default store;
