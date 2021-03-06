import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Home, GamePage, FeedbackPage, RankingPage } from './pages';
import './App.css';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" render={ (props) => <Home history={ props.history } /> } />
      <Route path="/game" component={ GamePage } />
      <Route path="/feedback" component={ FeedbackPage } />
      <Route path="/ranking" component={ RankingPage } />
    </Switch>
  );
}
