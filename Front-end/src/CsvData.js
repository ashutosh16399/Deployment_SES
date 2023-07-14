import axios from "axios";

import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, json, useNavigate } from "react-router-dom";

const CsvData = () => {

    const [isUploadView, setIsUploadView] = useState('');

    const navigate = useNavigate()
    const [inputVal, setInputVal] = useState('');
    const [loading, setLoading] = useState(false);

    const CommentsView = async (e) => {
        let input = e.target.value;
        setInputVal(input)
        const fileId = localStorage.getItem("csv-id");
        const file_id = JSON.parse(fileId).file_id;
        const file2_id = JSON.parse(fileId).file2_id;
        if (input === "comments") {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/result/${file_id}`);
                setIsUploadView(response.data.csv_data)
            } catch (error) {
                alert("Your file is deleted, Please Upload again!");
            }
        } else if (input === "stopwords") {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/result/${file2_id}`);
                setIsUploadView(response.data.csv_data)
            } catch (error) {
                alert("Your file is deleted, Please Upload again!")
            }
        }
    }

    const handleBack = async () => {
        const csvData = JSON.parse(localStorage.getItem('csv-id'))
        const formData = new FormData();

        formData.append('email', csvData.email)
        formData.append('file_id', csvData.file_id)
        formData.append('file2_id', csvData.file2_id)
        const response = await axios.post('http://127.0.0.1:5000/remove-file', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        navigate("/demo")
    }

    const sendMailHandler = async () => {
        setLoading(true);
        const emailData = JSON.parse(localStorage.getItem('csv-id'))
        const formData = new FormData();
        formData.append('email', emailData.email)
        formData.append('file_id', emailData.file_id)
        formData.append('file2_id', emailData.file2_id)
        const response = await axios.post('http://127.0.0.1:5000/send_mail', formData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            alert("Please check your mail")
        }
        setLoading(false);
    }

    return (
        <>
            <div className=''>
                 <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><Link to="/">Home</Link></li>
                <li class="breadcrumb-item"><Link to="/demo">Demo</Link></li>
                <li class="breadcrumb-item">CSV-Data</li>
            </ol>
        </nav>
                
                <div>
                    {/* <div>
                        {loading ? (
                            <div>Loading...</div> // Display the loader if loading state is true
                        ) : (
                            <button onClick={sendMailHandler}>Send Mail</button>
                        )}
                    </div> */}
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                        <label className="btn btn-secondary active">
                            <input type="radio" name="options" id="option1" autocomplete="off" value="comments" onChange={CommentsView} /> Comments
                        </label>
                        <label className="btn btn-secondary">
                            <input type="radio" name="options" id="option2" autocomplete="off" value="stopwords" onChange={CommentsView} /> StopWords
                        </label>
                    </div>
                </div>
            </div>
            {/* <HtmlResponse html={isUploadView}  /> */}
            <div className="container bg-transparent mt-5" style={{ display: 'block' }}>
                <div className="d-flex justify-content-between mb-5 align-items-center">
                    <button className="btn btn-danger" onClick={handleBack}>Back</button>
                    {loading ? (
                        <>
                        
                        <div>
                            <div class="spinner-border" style={{color: '#007200'}} role="status">
                                <span class="sr-only"></span>
                            </div>
                            <p style={{color: "#007200"}}>Training in progress. An email will be sent once the process is complete</p>
                        </div>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={sendMailHandler}>Train Modal</button>
                    )}
                </div>
                <div className=" mb-4 mt-2" >
                    {
                        isUploadView.length > 0 &&
                        (
                            <>
                                <table class="table table-bordered">
                                    <thead>
                                        {
                                            isUploadView.length > 0 && Array.isArray(isUploadView) && isUploadView.every((item) => typeof item !== 'string') ?
                                                <tr>
                                                    <th scope="col">No.</th>
                                                    <th className="text-start" scope="col">Data</th>
                                                    <th scope="col">Theme</th>
                                                    <th scope="col">Topics</th>
                                                </tr>
                                                :
                                                <>
                                                    <tr>
                                                        <th scope="col">StopWords</th>
                                                    </tr>
                                                </>
                                        }

                                    </thead>
                                    <tbody>
                                        {
                                            isUploadView.length > 0 && Array.isArray(isUploadView) && isUploadView.every((item) => typeof item !== 'string') ? isUploadView.map((item, index) => (
                                                <>
                                                    <tr key={index}>
                                                        <td>{item['No.']}</td>
                                                        <td className="text-start">{item.Data}</td>
                                                        <td>{item.Theme}</td>
                                                        <td>{item.Topics}</td>
                                                    </tr>
                                                </>
                                            )) :
                                                <>
                                                    {
                                                        isUploadView.map((item, index) => (
                                                            <tr key={index} style={{ width: '200px' }}>
                                                                <td>{item}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </>
                                        }
                                    </tbody>
                                </table>

                            </>
                        )


                    }
                </div>
            </div>
        </>
    )
}

export default CsvData