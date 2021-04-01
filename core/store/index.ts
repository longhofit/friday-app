import {
  createStore,
  applyMiddleware,
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './reducer';
import middlewares from './middleware';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['session','employee','user'],
  blacklist: [],
}

const middleWareEnhancer = applyMiddleware(...middlewares);
const persistedReducer = persistReducer(persistConfig, rootReducer)

export type AppState = ReturnType<typeof rootReducer>;

export const store = createStore(
  persistedReducer,
  composeWithDevTools(middleWareEnhancer),
);

export const persistor = persistStore(store);

