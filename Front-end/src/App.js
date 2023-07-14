import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Button } from 'react-bootstrap'

// importing the components
import HomePage from './HomePage';
import Header from './Header';
import FileUploadForm from './Demo';
import Success from './Success';
import ViewData from './ViewData';

// importing components for UI DASHBOARD
import UIDashboard from './UIDashboard';
import CsvData from './CsvData';
import PathHandler from './pathHandler';



function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Header />
        {/* <PathHandler/> */}
        {/* 
        defining all the routes to seperate webpages 
  */}
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/demo" element={<FileUploadForm />} />
          <Route path="/success" element={<Success />} />
          <Route path="/view-data" element={<ViewData />} />
          <Route path="/dashboard" element={<UIDashboard />} /> {/* New route with a dynamic parameter */}
          <Route path="/viewCsv" element={<CsvData />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
