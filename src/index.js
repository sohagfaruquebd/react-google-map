import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Login from './components/Login';

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import {store, persistor} from './store';

const app = document.getElementById('react-map-app');
render(
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <Router>
        <div>
            <Route exact path="/" name="Login" component={Login}></Route>
        </div>
    </Router>
    </PersistGate>
    </Provider>
    ,
  app);