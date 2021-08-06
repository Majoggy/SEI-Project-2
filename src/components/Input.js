import React from 'react'

import { getWord } from '../lib/api'

function Input({ setData, isHistoryPage, setIsHistoryPage,  wordHistory, setWordHistory }) {
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
      return false
    } 
  }

  const handleMove = async (e) => {
    let direction = 0
    switch (e.target.textContent) {
      case 'Back':
        (wordHistory.pointer > 0) ? direction = -1 : ''
        break
      case 'Forward':
        (wordHistory.pointer < wordHistory.words.length - 1) ? direction = 1 : ''
        break
    }
    if (direction !== 0) {
      const newPointer = wordHistory.pointer + direction
      setWordHistory({ ...wordHistory, pointer: newPointer })
      try {
        const response = await getWord(wordHistory.words[newPointer])
        setData(response.data)
        setIsHistoryPage(false)
      } catch (err) {
        return false
      } 
    }
  }

  const toggleHistory = () => {
    setIsHistoryPage(!isHistoryPage)
  }

  // applies a inverted class on button hover
  const handleEnter = async (e) => {
    e.target.classList.add('is-inverted')
  }
  // removes a inverted class on button hover
  const handleLeave = async (e) => {
    e.target.classList.remove('is-inverted')
  }

  // removes an inverted class on startup
  React.useEffect(() => {
    document.querySelector('#history-button').classList.remove('is-inverted')
  }, [])

  return (
    <div className='search-wrap'>
      <input className='input block is-large' id='searchBar' type='text' 
        placeholder='Search Word Definitions' onChange={handleChange}
      />
      <div className='button-wrap'>
        <button className='button is-info' id='back-button' 
          onClick={handleMove} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            Back
        </button>
        <button className='button is-success' id='forward-button' 
          onClick={handleMove} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          Forward
        </button>
        <button className={`button ${(isHistoryPage) ? 
          'is-danger is-inverted' : 'is-warning is-inverted'}`} id='history-button'
        onClick={toggleHistory} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          {(isHistoryPage) ? 'Search' : 'History'}
        </button>
      </div>
    </div>
  )
}

export default Input