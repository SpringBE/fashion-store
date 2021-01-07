from flask import Flask, jsonify,request,send_from_directory
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
import online_fashion_store_db as od
import os
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

@app.route('/categories/<section>')
def get_sub_categories(section):
    categories = od.get_categories(section)
    return jsonify({'categories':categories})

@app.route('/get-filters/<section>/<category_id>')
def get_filters(section,category_id):
    filters = od.get_filters_of_a_category(section,category_id)
    return jsonify({'filters':filters})

@app.route('/get_items/<section>/<category_id>')
def get_items(section,category_id):
    items = od.get_items_of_a_category(section,category_id)
    return jsonify({'items':items})

@app.route('/images/<section>/<category>/<image_name>')
def display_image(section,category,image_name):
    return send_from_directory('D:/angular/ShopEase/Server Side/images/'+section+'/'+category+'/', filename = image_name)
    #return send_from_directory('F:/Web Mini Project/online fashion store/Server Side/images/'+section+'/'+category+'/', filename = image_name)

@app.route('/filtered-items/<brand>/<size>/<color>/<minprice>/<maxprice>/<section_name>/<category_id>')
def get_filtered_data(brand,size,color,minprice,maxprice,section_name,category_id):
    brand = list(brand.split(','))
    size = list(size.split(','))
    color = list(color.split(','))
    minprice =int(minprice)
    maxprice=int(maxprice)
    items = od.get_filtered_items(brand,size,color,minprice,maxprice,section_name,category_id)
    return jsonify({'filtered_items':items})

@app.route('/sign-in/<email>/<password>')
def confirm_sign_in(email,password):
    confirmation = od.sign_in_confirmation(email,password)
    return jsonify({'flag':confirmation})

@app.route('/sign-up/<name>/<phone>/<email>/<password>')
def registration(name,phone,email,password):
    isEmailExist = od.email_confirmation(email)
    if isEmailExist:
        return jsonify({'emailExist':True,'addRecord':False})
    else:
        confirmation = od.addUser(name,phone,email,password)
        return jsonify({'emailExist':False, 'addRecord':confirmation})

if __name__ == "__main__":
    app.run(debug=True)