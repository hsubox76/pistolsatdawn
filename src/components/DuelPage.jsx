import React from 'react';
import DebateBox from './DebateBox';
import SpectatorBox from './SpectatorBox';
import '../styles/DuelPage.css';

const DuelPage = (props) => (
  <div className='duel-container'>
    <DebateBox />
    <SpectatorBox />
  </div>
);

export default DuelPage;