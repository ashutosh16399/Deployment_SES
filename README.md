# SES-What
Discover the power of our full-stack application. The back-end handles data processing and APIs, while the front-end offers a seamless user experience. Dive into UI data visualization for captivating data insights. Join us in building a scalable, secure, and visually appealing app

# SES What - Instructions

SES What is a full-stack application consisting of a front-end, back-end, and a UI dashboard for data visualization.

## Front-end (React.js)
The front-end folder contains the React.js application responsible for the user interface. To run the front-end:

1. Navigate to the `front-end` folder: `cd front-end`
2. Install dependencies: 
```
npm install
npm install chart.js chartjs-plugin-datalabels
npm install react-chartjs-2
npm install react-step-progress-bar
```
3. Start the development server: `npm start`
4. Access the front-end application at: `http://localhost:3000`

## Back-end (Flask)
The back-end folder contains the Flask application responsible for data processing and APIs. To run the back-end:

1. Navigate to the `Backend` folder: `cd Backend`
2. Create a virtual environment: `python3 -m venv env`
3. Activate the virtual environment: 
   - For macOS/Linux: `source env/bin/activate`
   - For Windows: `.\env\Scripts\activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Install Spacy model: `python -m spacy download en_core_web_sm`
5. Start the Flask server: `python app.py`
6. Access the back-end APIs at: `http://localhost:5000`

The back-end code performs various tasks, including file upload and processing, data manipulation, and sending emails. It utilizes additional libraries such as `Flask-CORS`, `dotenv`, `csv`, `datetime`, `apscheduler`, `celery`, `flask_mail`, and more.

Make sure to set the appropriate configurations in the `app.config` section of `app.py`, including the `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, and other necessary settings.

## UI Dashboard (React.js)
The ui-dashboard folder contains the React.js application for data visualization. To run the UI dashboard:

1. Navigate to the `UI Dashboard` folder: `cd UI Dashboard`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Access the UI dashboard at: `http://localhost:8000`

Make sure all three applications (front-end, back-end, and UI dashboard) are running simultaneously for the full functionality of the SES What application.