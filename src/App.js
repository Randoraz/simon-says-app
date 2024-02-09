import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  /* Variables */
  const [turn, setTurn] = useState(0);
  const [gameState, setGameState] = useState('waitStart');
  const [colorsArray, setColorsArray] = useState([]);
  const [inputArray, setInputArray] = useState([]);
  const [displayInfo, setDisplayInfo] = useState('game');

  const blueButton = useRef(null);
  const greenButton = useRef(null);
  const yellowButton = useRef(null);
  const redButton = useRef(null);

  // Fired by changes in the colorsArray
  useEffect(() => {
    if(gameState === 'waitStart')
      return;

    displayColor(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorsArray]);

  // Fired by changes in the inputArray
  useEffect(() => {
    if(gameState === 'waitStart')
      return;

    if(inputArray[inputArray.length - 1] !== colorsArray[inputArray.length - 1]) {
      setGameState('finished');
    }

    if(colorsArray.length > 0 && inputArray.length >= colorsArray.length) {
      setGameState('waitTurn');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputArray]);

  /* Functions */
  // Lights the color based on the current index
  const displayColor = index => {
    // If index is bigger or equal then the length of the colorsArray, then all colors were displayed
    // Set to default classes, finish the display phase and return
    if(index >= colorsArray.length) {
      blueButton.current.className = 'blue button position-1' + displayShadow();
      greenButton.current.className = 'green button position-2' + displayShadow();
      yellowButton.current.className = 'yellow button position-3' + displayShadow();
      redButton.current.className = 'red button position-4' + displayShadow();

      setGameState('waitInput');
      return;
    }

    // Adjust the buttons' classes based on the color to be displayed
    // setTimeout here will ensure the color will be back to default before the next one is displayed
    // In this way, the commands will be clear even if two successive indexes have the same color
    switch(colorsArray[index]) {
      case 'blue':
        blueButton.current.className += ' light';
        greenButton.current.className = 'green button position-2';
        yellowButton.current.className = 'yellow button position-3';
        redButton.current.className = 'red button position-4';

        setTimeout(() => {
          blueButton.current.className = 'blue button position-1';
        }, 500);
        break;
      case 'green':
        blueButton.current.className = 'blue button position-1';
        greenButton.current.className += ' light';
        yellowButton.current.className = 'yellow button position-3';
        redButton.current.className = 'red button position-4';

        setTimeout(() => {
          greenButton.current.className = 'green button position-2';
        }, 500);
        break;
      case 'yellow':
        blueButton.current.className = 'blue button position-1';
        greenButton.current.className = 'green button position-2';
        yellowButton.current.className += ' light';
        redButton.current.className = 'red button position-4';

        setTimeout(() => {
          yellowButton.current.className = 'yellow button position-3';
        }, 500);
        break;
      case 'red':
        blueButton.current.className = 'blue button position-1';
        greenButton.current.className = 'green button position-2';
        yellowButton.current.className = 'yellow button position-3';
        redButton.current.className += ' light';

        setTimeout(() => {
          redButton.current.className = 'red button position-4';
        }, 500);
        break;
      default:
        console.log('Unexpected color')
        return;
    }

    // Call the function recursively after a timeout
    setTimeout(() => {
      displayColor(index + 1);
    }, 700);
  }

  // Adds the color selected by the user to the inputArray
  const addInput = color => {
    if(gameState !== 'waitInput')
      return;
    
    setInputArray(prevInputs => [...prevInputs, color]);
  }

  // Generates a random color
  const getRandomColor = () => {
    const randomNum =  Math.floor(Math.random() * 4);
    switch(randomNum) {
      case 0:
        return 'blue';
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'red';
      default:
        console.log('Unexpected random number');
        return;
    }
  }

  // Resets the game by setting everything to the default state
  const resetGame = () => {
    setTurn(0);
    setGameState('waitStart');
    setColorsArray([]);
    setInputArray([]);
  }

  // Handles the Start/Next turn button
  // Starts a new turn by adding a new color to colorsArray and starting the display phase
  const handleMainClick = (e) => {
    if(gameState === 'finished') {
      resetGame();
      return;
    }

    setColorsArray(prevColors => [...prevColors, getRandomColor()]);
    setInputArray([]);
    setGameState('colorDisplay');
    
    setTurn(turn + 1);
  }

  const handleRadioChange = (e) => {
    setDisplayInfo(e.target.value);
  }

  // Checks wheather to display the box-shadow or not
  const displayShadow = () => {
    return gameState === 'colorDisplay' ? '' : ' shadow';
  }

  const getMainButtonText = () => {
    switch(gameState) {
      case 'waitStart':
        return 'Start';
      case 'waitTurn':
        return 'Next turn';
      case 'finished':
        return 'Restart';
      default:
        return 'Unhandled case';
    }
  }

  /* JSX */
  const mainButton = (<button
                        className={'main-button'}
                        onClick={handleMainClick}>
                          {getMainButtonText()}
                      </button>);

  const infoSection = (<section className='info-section'>
                        <p>Game state: {gameState}</p>
                        <p>Current turn: {turn}</p>
                        <p>Colors array: {colorsArray.join(', ')}</p>
                        <p>Inputs array: {inputArray.join(', ')}</p>
                      </section>);

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Simon Says App
        </h1>
      </header>
      <main>
        <form className='options-form'>
          <div className='form-field'>
            <input id='game' value='game' type='radio' name='options' onChange={handleRadioChange} defaultChecked />
            <label for='game'>Game mode</label>
          </div>
          <div className='form-field'>
            <input id='info' value='info' type='radio' name='options' onChange={handleRadioChange} />
            <label for='info'>Game state info</label>
          </div>
          <div className='form-field'>
            <input id='explain' value='explain' type='radio' name='options' onChange={handleRadioChange} />
            <label for='explain'>Explanation</label>
          </div>
        </form>

        {displayInfo === 'info' ? infoSection : null}

        <section className='buttons-section'>
          <button
            ref={blueButton}
            className={'blue button position-1' + displayShadow()}
            onClick={() => addInput('blue')}>
          </button>
          <button
            ref={greenButton}
            className={'green button position-2' + displayShadow()}
            onClick={() => addInput('green')}></button>
          <button
            ref={yellowButton}
            className={'yellow button position-3' + displayShadow()}
            onClick={() => addInput('yellow')}>
          </button>
          <button
            ref={redButton}
            className={'red button position-4' + displayShadow()}
            onClick={() => addInput('red')}>
          </button>
        </section>

        {gameState === 'waitStart' ||
         gameState === 'waitTurn'  ||
         gameState === 'finished'  ? mainButton : null}
      </main>
    </div>
  );
}

export default App;
