import React from 'react'

import Search from './Search'
import History from './History'
import Input from './Input'
import { getWord } from '../lib/api'

function Main() {
  const [data, setData] = React.useState(undefined)
  const [isHistoryPage, setIsHistoryPage] = React.useState(false)
  const audioObj = new Audio(undefined)
  const [fullHistory, setFullHistory] = React.useState([])
  const [wordHistory, setWordHistory] = React.useState({
    words: ['dictionary'],
    pointer: 0,
  })

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response = await getWord('dictionary')
        setData(response.data)
      } catch (err) {
        return false
      }
    }
    getData()
  }, [])

  const handleFullHistory = (word) => {
    const currentFullHistory = fullHistory
    currentFullHistory.push(word)
    setFullHistory(currentFullHistory)

    const currentWordHistory = { 
      words: wordHistory.words.slice(0, wordHistory.pointer + 1), 
      pointer: wordHistory.pointer + 1,
    }
    currentWordHistory.words.push(word)
    setWordHistory(currentWordHistory)
  }

  // Cuts out surrounding punctiation to get the word and updates page with it
  const handleLink = (e) => {
    const word = e.target.textContent
    const letters = word.split('')
    
    // Checking punctuation with ascii
    const isLetters = letters.map(letter => {
      const asciiValue = letter.charCodeAt(0)
      if (
        (asciiValue >= 65 && asciiValue <= 90) || 
        (asciiValue >= 97 && asciiValue <= 122)) {
        return (true)
      }
      return (false)
    })

    // Finding where the punctuation stops on either side of the word
    let firstLetterPosition = 0
    for (let i = 0; i < isLetters.length; i++) {
      if (isLetters[i] === true) {
        firstLetterPosition = i
        i = isLetters.length
      }
    }
    let lastLetterPosition = isLetters.length
    for (let i = isLetters.length; i >= 0; i--) {
      if (isLetters[i] === true) {
        lastLetterPosition = i + 1
        i = -1
      }
    }
    const trueWord = word.slice(firstLetterPosition, lastLetterPosition)

    return handleClick(trueWord)
  }

  const handleClick = async (search) => {
    try {
      const response = await getWord(search)
      setData(response.data)
      handleFullHistory(response.data[0].word)
      setIsHistoryPage(false)
      return true
    } catch (err) {
      return false
    } 
  }


  return (
    <section className='section'>
      <div className='container box border main-box'>
        <Input setData={setData} 
          isHistoryPage={isHistoryPage} setIsHistoryPage={setIsHistoryPage}  
          wordHistory={wordHistory} setWordHistory={setWordHistory}
        />

        {!isHistoryPage && data && 
          <Search data={data} audioObj={audioObj} handleLink={handleLink} />
        }
        {isHistoryPage && 
          <History fullHistory={fullHistory} handleLink={handleLink} />
        }
      </div>
    </section>
    
    
  )
}

export default Main