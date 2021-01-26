from flask import Flask, jsonify,request,send_from_directory
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
import online_fashion_store_db as od
import os
import json
from werkzeug.utils import secure_filename
import ast

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
    #return send_from_directory('D:/angular/ShopEase/Server Side/images/'+section+'/'+category+'/', filename = image_name)
    return send_from_directory('F:/Web Mini Project/online fashion store/Server Side/images/'+section+'/'+category+'/', filename = image_name)

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

@app.route('/add-item', methods = ['POST'])
def add_product():
    images = request.files.getlist("images")
    details = request.form.get('details')
    details = ast.literal_eval(details)
    print(details)
    print(type(details['name']))
    i = 0
    for image in images:
        extension = image.filename.split(".")[-1]
        filename = details['name'] + " " + details['colors'][i] + '.' + extension
        filename = secure_filename(filename)
        #path = 'E:/projects/celestia/Celestia/MusiCafe/Server Side/images/' + details['section'].lower() + '/' + details['category'].lower + '/'
        path = 'F:/Web Mini Project/online fashion store/Server Side/images/' + details['section'].lower() + '/' + details['category'].replace(" ","-").lower() + '/'
        image.save(os.path.join(path,filename))
        path = str(details['section']).lower() + '/' + details['category'].replace(" ","-").lower() + '/' + filename
        details['images'][i][details['colors'][i]] = path
        i += 1
    
    success = od.add_product_to_section(details)
    return jsonify({'added':success})

@app.route('/delete-item', methods = ['POST'])
def delete_item():
    req = request.get_json()
    confirmation = od.delete_item_from_db(req)
    return jsonify({'deleted':confirmation})

@app.route('/add-to-cart', methods=['POST'])
def get_cart_items():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    cart = request.json.get('cart_items', None)
    total = request.json.get('grand_total', None)
    date =  request.json.get('order_date', None)
    address=request.json.get('address', None)
    email=request.json.get('email', None)
    success = od.add_to_cart(cart,total,date,address,email)
    return jsonify({'addToCart':success})

@app.route('/order-details/<email>')
def get_order_details(email):
    order_details = od.getOrderDetails(email)
    return jsonify({'orders':order_details})

@app.route('/change-password', methods = ['POST'])
def changePassword():
    req = request.get_json()
    confirm = od.change_password(req)
    return jsonify({'isSet':confirm})

@app.route('/all-orders')
def get_all_orders():
    all_orders = od.getOrderDetails("all")
    return jsonify({'orders':all_orders})

@app.route('/set-order-to-delivery/<id>')
def set_order(id):
    confirm = od.set_order_to_delivery(id)
    return jsonify({'isSet':confirm})

@app.route('/search/<pattern>')
def search(pattern):
    documents = od.search_product(pattern)
    return jsonify({'search':documents})

if __name__ == "__main__":
    app.run(debug=True)