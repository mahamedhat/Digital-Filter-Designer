import numpy as np
import pandas as pd
from scipy import signal
from flask import (Flask, json, jsonify, redirect, render_template, request,
                   url_for)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    
    app.run()