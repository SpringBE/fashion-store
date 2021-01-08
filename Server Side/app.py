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

@app.route('/sign-in', methods = ['POST'])
def confirm_sign_in():
    req = request.get_json()
    confirmation = od.sign_in_confirmation(req['email'],req['password'])
    if confirmation:
        user = od.get_user_details(req['email'])
        return jsonify({'flag':True, 'details':user})
    else:
        return jsonify({'flag':False})

@app.route('/sign-up', methods = ['POST'])
def registration():
    req = request.get_json()
    isEmailExist = od.email_exists_confirmation(req['email'])
    if isEmailExist:
        return jsonify({'emailExist':True,'addRecord':False})
    else:
        confirmation = od.addUser((req['firstName'] + " " + req['lastName']),req['phone'],req['email'], req['password'])
        user = od.get_user_details(req['email'])
        if(len(user) == 0):
            return jsonify({'emailExist':False, 'addRecord':False})
        else:
            return jsonify({'emailExist':False, 'addRecord':True, 'user':user})

@app.route('/save-address', methods = ['POST'])
def save_address():
    req = request.get_json()
    print(req['email'], req['address'])
    confirmation = od.save_address_toUser(req['email'], req['address'])
    return jsonify({'saved':confirmation})

@app.route('/get-userInfo/<email>')
def get_user_info(email):
    details = od.get_user_details(email)
    return jsonify({'details':details})

@app.route('/update-profile', methods = ['POST'])
def update_user_profile():
    req = request.get_json()
    confirmation = od.updateUserProfile(req)
    return jsonify({'updated':confirmation})

if __name__ == "__main__":
    app.run(debug=True)