from server import app
from flask import request
from flask import render_template
from scipy import signal



if __name__ == '__main__':

    app.run(debug=True, port=5000)
