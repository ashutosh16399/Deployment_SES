import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { Axios } from 'axios';
import MultiStepProgressBar from "./MultiStepProgressBar";
import Papa from 'papaparse';
import { Button } from 'react-bootstrap';
import CsvData from './CsvData';

const FileUploadForm = () => {
  const [email, setEmail] = useState('');
  const [file1, setFile1] = useState(null); 
  const [file2, setFile2] = useState(null);
  const [data, setData] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCommentView, setIsCommentView] = useState(true)
  const [isStopWordsView, setIsStopWordsView] = useState(false)
  const [isResponse, setIsResponse] = useState(null)
  const [isUploadView, setIsUploadView] = useState('');



  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef();
  const StopWordsRef = useRef();
  const CommentsRef = useRef();
  const navigate = useNavigate()

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFile1Change = (e) => {
    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const dataKeys = Object.keys(results.data[0]);
        const duplicateValues = dataKeys.filter((value, index) => dataKeys.indexOf(value) !== index);

        if ('Data' in results.data[0]) {
          setData(true)
          setFile1(e.target.files[0]);
        } else if (duplicateValues.includes("Data")) {
          setData(false)
        }
        else {
          setData(false)
        }
      },
    });
  };

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file1);
    formData.append('file2', file2)
    // formData.append('swfile', file2);
    if (data) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/process', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Handle success
        console.log('Files uploaded successfully!');
        const jsonData = response.data;
        setIsResponse(jsonData);
        localStorage.setItem("csv-id", JSON.stringify(jsonData))
        setCurrentStep((prevStep) => prevStep + 1);
        navigate("/viewCsv")
        setIsSuccess(true);
      } catch (error) {
        // Handle error
        console.error(error);
      }
    } else {
      alert("Please resubmit your files");
      if (fileInputRef) {
        fileInputRef.current.value = null;
      }
      if (CommentsRef) {
        CommentsRef.current.value = null;
      }
      if (StopWordsRef) {
        StopWordsRef.current.value = null;
      }
    }
  };


  return (
    <>
      <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                <li class="breadcrumb-item">Demo</li>
            </ol>
        </nav>
      <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>

        <div className='col-sm-6 '>

          <h2>File Upload</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                className='form-control'
                type='email'
                placeholder='Email'
                value={email}
                ref={fileInputRef}
                onChange={handleEmailChange}
                required
              />
            </div>
            <br />
            <div>
              <label>Comments CSV File:</label>
              <input
                className='form-control'
                type='file'
                onChange={handleFile1Change}
                ref={CommentsRef}
                accept='.csv'
                required
              />
            </div>
            <br />
            <div>
              <label>StopWords CSV File:</label>
              <input
                className='form-control'
                type='file'
                onChange={handleFile2Change}
                ref={StopWordsRef}
                accept='.csv'
                required
              />
            </div>
            <br />
            <button className='btn btn-primary' type='submit'>
              Upload
            </button>
          </form>

        </div>

      </div>
    </>
  );
};

export default FileUploadForm;

