import { combineReducers, createStore } from 'redux';
import categories from './categories';
import events from './events';
import locations from './locations';
import loginInfo from './loginInfo';
import session from './session';
import user from './user';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
  user,
  session,
  locations,
  categories,
  events,
  loginInfo,
});

const store = createStore(rootReducer);

export default store;
