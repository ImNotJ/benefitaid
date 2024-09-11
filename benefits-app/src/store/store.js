import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; 
import { composeWithDevTools } from 'redux-devtools-extension';
import adminReducer from './reducers/adminReducer';
import benefitReducer from './reducers/benefitReducer';
import questionReducer from './reducers/questionReducer';
import quizReducer from './reducers/quizReducer';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({
  admin: adminReducer,
  benefit: benefitReducer,
  question: questionReducer,
  quiz: quizReducer,
  user: userReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;