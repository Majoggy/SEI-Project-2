import axios from 'axios'

const baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en_US'

export function getWord(word) {
  return axios.get(`${baseUrl}/${word.toLowerCase()}`)
}