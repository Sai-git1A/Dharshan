import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home/Home';
import Images from './Images/Images';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path='/images' element={<Images />} />
      </Routes>
    </Router>
  );
}
