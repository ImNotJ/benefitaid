import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import adminReducer from './reducers/adminReducer';
import benefitReducer from './reducers/benefitReducer';
import questionReducer from './reducers/questionReducer';
import quizReducer from './reducers/quizReducer';
import userReducer from './reducers/userReducer';

// Combine all the reducers into a single root reducer
const rootReducer = combineReducers({
  admin: adminReducer,
  benefit: benefitReducer,
  question: questionReducer,
  quiz: quizReducer,
  user: userReducer,
});

// Create the Redux store with the root reducer, Redux DevTools, and middleware
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;