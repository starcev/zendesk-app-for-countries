import React, { Component } from 'react'
import { render } from 'react-dom'
import CountriesApp from './components/countriesApp'

const MIN_HEIGHT = 300;

class App {

  constructor (client, _appData) {
    this._client = client
    this.initializePromise = this.init()
  }

  async init () {
    const appContainer = document.querySelector('.main')
    render(
      <CountriesApp client={this._client} />,
      appContainer
    )
  }

  _handleError (error) {
    console.log('An error is handled here: ', error.message)
  }
}

export default App
