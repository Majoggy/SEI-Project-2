import React from 'react'
import { getWord } from '../lib/api'

function Search() {
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
        console.log(err)
      }
    }
    getData()
  }, [])

  const handleChange = async (e) => {
    let search = e.target.value
    if (search === '') {
      search = 'dictionary'
    }

    try {
      const response = await getWord(search)
      setData(response.data)
      setIsHistoryPage(false)
    } catch (err) {
      console.log(err)
    } 
  }

  const handleClick = async (search) => {
    try {
      const response = await getWord(search)
      setData(response.data)
      handleFullHistory(response.data[0].word)
      setIsHistoryPage(false)
    } catch (err) {
      console.log(err)
    } 
  }

  const toggleHistory = () => {
    setIsHistoryPage(!isHistoryPage)
  }
  

  const handleFullHistory = (word) => {
    const currentFullHistory = fullHistory
    currentFullHistory.push(word)
    setFullHistory(currentFullHistory)

    const currentWordHistory = wordHistory
    currentWordHistory.words = wordHistory.words.slice(0, wordHistory.pointer + 1)
    currentWordHistory.words.push(word)
    currentWordHistory.pointer++
    setWordHistory(currentWordHistory)
    console.log(currentWordHistory)
  }

  const handleBack = async () => {
    if (wordHistory.pointer > 0) {
      setWordHistory({ ...wordHistory, pointer: wordHistory.pointer - 1 })
      try {
        const response = await getWord(wordHistory.words[wordHistory.pointer - 1])
        setData(response.data)
        setIsHistoryPage(false)
      } catch (err) {
        console.log(err)
      } 
    }
  }

  const handleForward = async () => {
    if (wordHistory.pointer < wordHistory.words.length - 1) {
      setWordHistory({ ...wordHistory, pointer: wordHistory.pointer + 1 })
      try {
        const response = await getWord(wordHistory.words[wordHistory.pointer + 1])
        setData(response.data)
        setIsHistoryPage(false)
      } catch (err) {
        console.log(err)
      } 
    }
  }

  // Creates new object so original array is not reversed
  const reverseInput = (inputs) => {
    const outputs = [ ...inputs ]
    return (outputs.reverse())
  }

  const handleAudio = async (e) => {
    audioObj.src = e.target.id
    audioObj.play()
  }

  // applies a bold class on hover
  const handleEnter = async (e) => {
    e.target.className = 'bold-text'
  }
  // removes a bold class on hover
  const handleLeave = async (e) => {
    e.target.className = ''
  }


  // returns sentences with each word wrapped in a span with onClicks
  const wordLinks = (text, isSentence) => {
    const texts = text.split(' ')

    // set first letter capital and end in full stop
    if (isSentence) {
      const firstWord = texts[0].split('')
      firstWord[0] = firstWord[0].toUpperCase()
      texts[0] = firstWord.join('')
      const lastWord = texts[texts.length - 1].split('')
      if (lastWord[lastWord.length - 1] !== '.') {
        lastWord.push('.')
        texts[texts.length - 1] = lastWord
      }
    }

    const linkedTexts = texts.map((word, index) => {
      return (
        <span key={index}><span onClick={handleLink} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>{word}</span> </span>
      )
    })
    return (linkedTexts)
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

    handleClick(trueWord)
  }

  return (
    <section className='section'>
      <div className='container box border'>
        <div className='search-wrap'>
          <input className='input block is-large' id='searchBar' type='text' placeholder='Search Word Definitions' onChange={handleChange}></input>
          <div className='button-wrap'>
            <button className="button is-info" id='back-button' onClick={handleBack}>Back</button>
            <button className="button is-success" id='forward-button' onClick={handleForward}>Forward</button>
            <button className={`button ${(isHistoryPage) ? 'is-danger' : 'is-warning'}`} id='history-button' onClick={toggleHistory}>{(isHistoryPage) ? 'Search' : 'History'}</button>
          </div>
        </div>
        
        
        {!isHistoryPage && data && 
          <div className='container'>
            {data.map((item, index) => {
              return (
                <div key={index} className='box border'>
                  <h3 className='title'>{wordLinks(item.word)}</h3>
                  {item.phonetics && 
                  item.phonetics.map((item, index) => {
                    return (
                      <div key={index}>
                        {item.text && <button id={item.audio} onClick={handleAudio}>{item.text}</button>}
                      </div>
                    )
                  })}
                  {item.meanings.map((mean, index) => {
                    return (
                      <div key={index}>
                        <h4 className='block subtitle' id='partOf'><i>{wordLinks(mean.partOfSpeech)}</i></h4>
                        {mean.definitions.map((def, index) => {
                          return (
                            <div key={index} className='box border'>
                              {def.definition && <p><strong>Definition{(mean.definitions.length > 1) ? ` ${index + 1}` : ''}: </strong>{wordLinks(def.definition, true)}</p>}
                              {def.example && <p><strong>Example:</strong> {wordLinks(def.example, true)}</p>}
                              {def.synonyms && <p><strong>Synonyms:</strong> {wordLinks(def.synonyms.join(', '), true)}</p>}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        }
        {isHistoryPage && 
          <div className='container'>
            <div className='box border'>
              <div className='columns is-multiline'>
                {reverseInput(fullHistory).map((word, index) => {
                  return (
                    <div key={index} className='column'>
                      <button className='button is-warning' onClick={handleLink}>{word}</button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        }
      </div>
    </section>
    
    
  )
}

export default Search