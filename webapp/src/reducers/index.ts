import { combineReducers, createStore } from 'redux';
import categories from './categories';
import events from './events';
import formats from './formats';
import loginInfo from './loginInfo';
import offices from './offices';
import organisations from './organisations';
import session from './session';
import statuses from './statuses';
import user from './user';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
  user,
  session,
  categories,
  organisations,
  events,
  loginInfo,
  offices,
  formats,
  statuses,
});

const store = createStore(rootReducer);

export default store;
