import { useState, useEffect, useRef } from 'react'
import './App.css'
import Die from './components/Die.jsx'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [dice, setDice] = useState(() => generateAllNewDice())  // wrap function in function so function only runs once on multiple re-renders
  const [rollCounter, setRollCounter] = useState(0)
  const buttonRef = useRef(null)  // save values between render cycles without re-render

  let gameWon = dice.filter(x => x.value === dice[0].value && x.isHeld).length === 10

  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
    }
  }, [gameWon])

  function generateAllNewDice () {
    return new Array(10)
    .fill(0)
    .map(() => ({
      value: Math.ceil(Math.random() * 6), 
      isHeld: false,
      id: nanoid(),
      hold: hold
    }))
  }
  
  function hold (id) {
    setDice(prevDiceObj => prevDiceObj.map(dieObj =>
      dieObj.id === id ? {...dieObj, isHeld: !dieObj.isHeld} : dieObj
    ))
  }
  
  function rollDice () {
    setDice(prevDiceObj => prevDiceObj.map(dieObj =>
      dieObj.isHeld === true ? dieObj : {...dieObj, value: Math.ceil(Math.random() * 6)}
    ))
    setRollCounter(prevRollCount => prevRollCount + 1)
  }
  
  function newGame () {
    setDice(generateAllNewDice())
    setRollCounter(0)
  }

  const diceElements = dice.map(dieObj => (
    <Die 
      key={dieObj.id} 
      value={dieObj.value} 
      isHeld={dieObj.isHeld} 
      id={dieObj.id}
      hold={hold}
    />)
  )

  return (
    <>
      {gameWon && <Confetti />}
      <div aria-live='polite' className='sr-only'>
        {gameWon && <p>Congratulations! You won! Press 'New Game' to start again.</p>}
      </div>
      <main>
        <h1 className='title'>Tenzies</h1>
        <p className='instructions'>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <section className='dice-container'>
          {diceElements}
        </section>
        <button ref={buttonRef} className='roll-dice' onClick={gameWon ? newGame : rollDice}>{gameWon ? 'New Game' : 'Roll'}</button>
        <div>Roll Counter: {rollCounter}</div>
      </main>
    </>
  )
}

export default App
