import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchQuestions, setScore as scoreAction } from '../redux/actions/index';

import './questions.css';
import Timer from './Timer';
import ButtonNext from './ButtonNext';

const scorePerLevel = { hard: 3, medium: 2, easy: 1 };

class Questions extends Component {
  constructor() {
    super();
    this.state = {
      isClick: false,
      time: 30,
      timerId: null,
      disabled: false,
      questionActual: 0,
    };

    this.handleIncorrect = this.handleIncorrect.bind(this);
    this.handleCorrect = this.handleCorrect.bind(this);
    this.clock = this.clock.bind(this);
    this.setClock = this.setClock.bind(this);
    this.handleButtonNext = this.handleButtonNext.bind(this);
  }

  componentDidMount() {
    const { fetchQuestionsAPI } = this.props;
    fetchQuestionsAPI();
  }

  setClock() {
    const SECOND = 1000;
    const timerId = setInterval(() => this.clock(), SECOND);
    this.setState({ timerId });
  }

  clock() {
    const { time, timerId } = this.state;
    if (time > 0) {
      this.setState(
        (previousState) => ({ time: previousState.time - 1 }),
      );
    } else {
      clearInterval(timerId);
      this.setState({ disabled: true });
    }
  }

  handleIncorrect() {
    this.setState({ isClick: true });
  }

  handleCorrect() {
    const { setScore, questions } = this.props;
    const { difficulty } = questions[0];
    const { time } = this.state;
    const BASE_SCORE = 10;
    const score = BASE_SCORE + (time * scorePerLevel[difficulty]);

    this.setState({ isClick: true }, () => setScore(score));
  }

  handleButtonNext() {
    const { questionActual } = this.state;
    const questionNext = questionActual + 1;
    this.setState({
      questionActual: questionNext,
      isClick: false,
    });
  }

  render() {
    const { questions } = this.props;
    const { isClick, time, disabled, questionActual } = this.state;

    if (questions.length > 0) {
      return (
        <div>
          <h2 data-testid="question-category">
            { questions[questionActual].category }
          </h2>
          <p data-testid="question-text">
            { questions[questionActual].question }
          </p>
          <button
            type="button"
            data-testid="correct-answer"
            className={ isClick ? 'correct-answer' : null }
            onClick={ this.handleCorrect }
            disabled={ disabled }
          >
            { questions[questionActual].correct_answer }
          </button>
          { questions[questionActual].incorrect_answers.map((question, index) => (
            <button
              key={ index }
              type="button"
              data-testid={ `wrong-answer-${index}` }
              className={ isClick ? 'incorrect-answers' : null }
              onClick={ this.handleIncorrect }
              disabled={ disabled }
            >
              { question }
            </button>
          ))}
          <Timer time={ time } setTimer={ this.setClock } />
          { isClick && <ButtonNext onClick={ this.handleButtonNext } /> }
        </div>
      );
    }

    return (
      <div>
        Carregando...
      </div>
    );
  }
}

Questions.propTypes = {
  fetchQuestionsAPI: PropTypes.func.isRequired,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  setScore: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  questions: state.game.questions,
});

const mapDispatchToProps = (dispatch) => ({
  fetchQuestionsAPI: () => dispatch(fetchQuestions()),
  setScore: (score) => dispatch(scoreAction(score)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Questions);
