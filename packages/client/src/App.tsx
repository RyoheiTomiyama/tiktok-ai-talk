import React from 'react';
import { useQuery } from '@tanstack/react-query'
import logo from './logo.svg';
import './App.css';
import { voicevoxClient } from './utils/axios';
import { Env } from './utils/env';
import Voicevox from '@/models/voicevox';
import A3rt from './models/a3rt';

function App() {
  const voicevox = new Voicevox()
  const a3rt = new A3rt()
  const query = useQuery(['voice'], async () => {
    const audioQueryResult = await voicevox.audioQuery()

    const synthesisResult = await voicevox.synthesis(audioQueryResult)
    const result = await a3rt.smalltalk('やっほおーー')

    console.log('post end')
    // console.log(synthesisResult.config, synthesisResult.headers)

  })
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
