from flask import Flask, abort, jsonify, request, render_template
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pathlib import Path, PosixPath
import csv
import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from celery import Celery
from flask_mail import Mail, Message
from DataHandler import DataHandler
import pandas as pd
import requests
import model


def initialise_data_handler(base_path, data_file):
    """
    Initializes the DataHandler instance and ensures the data file exists.

    Args:
        base_path (str): Base path for storing data files.
        data_file (str): Data file name.

    Returns:
        DataHandler: An instance of the DataHandler class.
    """
    # Check if data file exists
    fpath = os.path.join(base_path, data_file)
    if not os.path.isfile(fpath):
        # Create an empty file if it doesn't exist
        with open(fpath, 'w', encoding="utf8"):
            pass
    # Create an instance of the DataHandler class
    dh = DataHandler(fpath, base_path)
    return dh


BASE_PATH = os.path.join(os.path.dirname(__file__), "uploads")
DATA_HANDLER_FILE = 'data.json'
dh = initialise_data_handler(BASE_PATH, DATA_HANDLER_FILE)


def delete_old_csv_files():
    """
    Deletes old CSV files based on the maximum age in days.
    """
    max_age_days = 1  # Maximum age of CSV files in days
    dh.cleanup_csv_files(max_age_days)


scheduler = BackgroundScheduler()
scheduler.add_job(delete_old_csv_files, 'interval', days=1)  # Run the function every day
scheduler.start()

app = Flask(__name__, template_folder="templates", static_folder="static")
app.config['MAILGUN_API_KEY'] = 'ddca89a09e1673f342bf4d91c74a70f2-07ec2ba2-97026b86'
app.config['MAILGUN_DOMAIN'] = 'sandbox2e77a264437341cc910652b502dbf4ea.mailgun.org'

CORS(app, origins=['*'])
celery = Celery(app.name, broker='redis://localhost:6379/0')
celery.conf.update(app.config)
mail = Mail(app)



################################## API Functions below ############################################

@app.route("/process", methods=["POST"])
def process():
    """
    Handles the file upload and processing request.

    Returns:
        jsonify: JSON response with a message and file IDs.
    """
    email = request.form.get('email')
    file1 = request.files.get("file")
    file2 = request.files.get("file2")

    if not email:
        return jsonify({"message": "Email input is missing"}), 400

    file_name = None
    file_id = None
    if file1:
        if file1.filename == '':
            return abort(400, "Invalid file name")
        if not file1.filename.endswith(".csv"):
            return jsonify({"message": "The first file is not a CSV file"}), 400
        file_name = file1.filename
        file_extentions = ".csv"
        file_id = dh.add_csv_file(email, file1, file_extentions, "")

    file2_name = None
    if file2:
        if file2.filename == '':
            return abort(400, "Invalid second file name")
        if not file2.filename.endswith(".csv"):
            return jsonify({"message": "The second file is not a CSV file"}), 400
        file2_name = file2.filename
        file_extentions = "_sw.csv"
        file2_id = dh.add_csv_file(email, file2, file_extentions, file_id)

    return jsonify({"message": "Files uploaded successfully", "file_id": file_id, "email": email}), 200


@app.route("/result/<file_id>", methods=["GET"])
def display_result(file_id):
    """
    Retrieves and displays the processed CSV data.

    Args:
        file_id (str): ID of the CSV file.

    Returns:
        jsonify: JSON response with the CSV data.
    """
    email = dh.get_email_from_csv_id(file_id)
    if not email:
        abort(404, "Email not found for the given CSV ID.")

    csv_file = os.path.join(BASE_PATH, email, f"{file_id}.csv")
    data, csv_data = retrieve_csv_data(csv_file)
    sw_csv_file = os.path.join(BASE_PATH, email, f"{file_id}_sw.csv")
    sw_data, sw_csv_data = retrieve_csv_data(sw_csv_file)

    return jsonify({"csv_data": data, "csv_list_data": csv_data, "sw_csv_data": sw_data,  "sw_csv_list_data":sw_csv_data})


def retrieve_csv_data(csv_file):
    if not os.path.exists(csv_file):
        abort(404, "File not found")

    with open(csv_file, "r", encoding="utf8") as f:
        reader = csv.reader(f)
        header = next(reader)
        csv_data = list(reader)

    data = []
    if csv_data:
        for row in csv_data:
            if len(row) == len(header):
                data.append(dict(zip(header, row)))
    else:
        data.append(header)
        data = data[0]
    return data, csv_data

@app.route("/remove-file", methods=["POST"])
def remove_csv_files():
    """
    Removes the specified CSV files.

    Returns:
        jsonify: JSON response with a success message.
    """
    data = request.get_json()
    email = data.get('email')
    file_id = data.get("file_id")
    dh.remove_csv_file(email_id=email, csv_id=file_id)
    return jsonify("thank you!")


import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


@app.route('/send_mail', methods=['POST'])
def send_mail_function():
    """
    Sends an email with a link to the processed CSV.

    Returns:
        jsonify: JSON response with a success or error message.
    """
    data = request.get_json()
    email = data.get('email')
    file_id = data.get('file_id')

    long_running_task(email, file_id)

    if not email:
        return jsonify({"Message": "Email is required"})

    if not file_id:
        return jsonify({"Message": "File is required"})

    return jsonify({"Message": "Email sent"})


@celery.task
def long_running_task(email, csv_id):
    """
    Performs the long-running task on the CSV file.

    Args:
        email (str): Email address.
        csv_id (str): ID of the first CSV file.
    """
    file_path = os.path.join(BASE_PATH, email, csv_id + '.csv')
    file_path2 = os.path.join(BASE_PATH, email, csv_id + '_sw.csv')

    print("Starting task...")
    print("File path:", file_path)

    try:
        df = pd.read_csv(file_path)  # Assuming it's a CSV file, no need to specify the engine
        sd = pd.read_csv(file_path2)
        Stop_data = list(sd.columns)
        df = model.call_everything(df, Stop_data)
        output_file_path = os.path.join(BASE_PATH, email, csv_id + '.csv')
        df.to_csv(output_file_path, index=False)

        # ...
        print("Task completed successfully!")
    except Exception as e:
        print("An error occurred:", str(e))
        return

    url = f'Hello,\nComment CSV: http://localhost:3001/?result={csv_id}'
    print(url)
    send_email(email, url)


def send_email(email, url):
    """
    Sends an email with the specified URL.

    Args:
        email (str): Email address.
        url (str): URL to be included in the email.

    Returns:
        jsonify: JSON response with a success or error message.
    """
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'capstone.ses.what@gmail.com'
    smtp_password = 'phrbgawlsyfjsmvl'

    # Email content
    subject = 'Hello!'
    message = url

    try:
        # Create a multipart message
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = email
        msg['Subject'] = subject

        # Attach the message to the email
        msg.attach(MIMEText(message, 'plain'))

        # Connect to the SMTP server and send the email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_username, smtp_password)
            server.send_message(msg)

        return jsonify({'message': 'Email sent successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/perform_model_task', methods=['POST'])
def perform_task():
    """
    Performs the model task asynchronously.

    Returns:
        jsonify: JSON response with a success message.
    """
    data = request.get_json()
    csv_id = data.get('csv')
    print('\nCSV ID' + str(csv_id))
    email = dh.get_email_from_csv_id(csv_id)
    if email:
        print("Email ID:", email)
    else:
        print("Email not found for the given CSV ID.")
    if not email:
        return jsonify({'message': 'Email input is missing'}), 400
    if not csv_id:
        return jsonify({'message': 'CSV input is missing'}), 400

    long_running_task.delay(email, csv_id)  # Enqueue the task for asynchronous execution

    return jsonify({'message': 'Task enqueued'})


if __name__ == "__main__":
    app.run(debug=True)
    app.config["TEMPLATES_AUTO_RELOAD"] = True
