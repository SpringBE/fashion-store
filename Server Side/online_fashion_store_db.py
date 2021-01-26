from pymongo import MongoClient
import bson
from pprint import pprint
from datetime import datetime, timedelta
import re

'''db = MongoClient("mongodb+srv://celestia:celestia0121@cluster0.rbqpa.mongodb.net/fashionstore?retryWrites=true&w=majority")
mydb = db.fashionstore'''
db=MongoClient('localhost',27017)
mydb=db['fashionstore']

products = mydb['Products']
login = mydb['login']
orders=mydb['Orders']
dummy=mydb['dummy']

def get_categories(section):
    category_cursor = products.find({"section_name":section},
    { "Categories.category_id":1, "Categories.category_name":1, "Categories.category_image":1,"_id":0})
    categories = []
    for category in category_cursor:
        categories.append(category)
    return categories


def get_filters_of_a_category(section,category_id):
    filter_cursor = products.aggregate([
        {
            "$unwind":"$Categories"
        },
        {
            "$match":{
                "section_name":section,
                "Categories.category_id":category_id
            }
        },
        {
            "$unwind":"$Categories.Items"
        },
        {
            "$unwind":"$Categories.Items.item_size"
        },
        {
            "$unwind":"$Categories.Items.colors"
        },
        {
            "$group":{
                "_id":"$Categories.category_id",
                "Brands":{"$addToSet":"$Categories.Items.item_brand"},
                "Item_Size":{"$addToSet":"$Categories.Items.item_size"},
                "Colors":{"$addToSet":"$Categories.Items.colors"},
                "Maximum_Price": {"$max":"$Categories.Items.item_price"},
                "Minimum_Price":{"$min":"$Categories.Items.item_price"}
            }
        },
        {
            "$project":{
                "Brands":1,
                "Item_Size":1,
                "Colors":1,
                "Maximum_Price":1,
                "Minimum_Price":1,
                "_id":0
            }
        }
        ])
    
    filters = []
    for row in filter_cursor:
        filters.append(row)
    return filters

def get_items_of_a_category(section_name,category_id):
    items_cursor = products.find(
        {
            "section_name":section_name,
            "Categories.category_id":category_id
        },
        {
            "Categories.$.Items":1,
            "_id":0
        })
    
    items = []

    for item in items_cursor:
        items.append(item)
    
    return items

def get_filtered_items(brand,size,color,minprice,maxprice,section_name,category_id):
    filtered_items_cursor = products.aggregate([
        {
            "$unwind":"$Categories"
        },
        {
            "$unwind":"$Categories.Items"
        },
        {
            "$match":{
                "section_name": section_name,
                "Categories.category_id": category_id,
                "Categories.Items.colors":{ "$in": color },
                "Categories.Items.item_brand": { "$in": brand },
                "Categories.Items.item_size": { "$in": size },
                "Categories.Items.item_price": { "$gte": minprice, "$lte":maxprice  }
            }
        },
        { 
            "$project":{
                "filtered_items": "$Categories.Items",
                "_id":0
            }
        }

        ])
    
    filtered_items = []
    for item in filtered_items_cursor:
        filtered_items.append(item)
    return filtered_items

def get_user_details(email):
    detail_cursor = login.find({'email':email}, {'_id':0})
    user = []
    for detail in detail_cursor:
        user.append(detail)
    
    return user

def sign_in_confirmation(email,password):
    record_count = login.find({'email':email, 'password':password}).count()
    if record_count == 1:
        return True
    else:
        return False

def email_exists_confirmation(email):
    record_count = login.find({'email':email}).count()

    if record_count == 0:
        return False
    else:
        return True

def addUser(name,phone,email,password):
    confirmation = login.insert({'name':name, 'phone':phone, 'email':email, 'password':password, 
                        'addresses':[], 'dob':"", 'location':"", 'gender':"", 'alt_phone':"",
                        'isAdmin':False})
    if confirmation:
        return True
    else:
        return False

def save_address_toUser(email,address):
    '''rec_count = 0
    count_cursor = login.aggregate([
    {
        "$match":{
            "email":"hmpsharma@gmail.com"
        }
    },
    {
        "$project":{
        "address_count":{"$size":"$addresses"},
        "_id":0
        }
    }])
    
    for count in count_cursor:
        rec_count = count['address_count']

    address_id = "a_" + rec_count  '''  

    success = login.update(
        {
            "email":email
        },
        {
            "$addToSet":{"addresses":{"name":address['name'], "phone":address['phone'], 
                "city":address['city'], "address":address['address'], "state":address['state'],
                "pincode":address['pincode'], "addressType":address['addressType']}}
        }
    )

    if success['nModified']:
        return True
    else:
        return False

def updateUserProfile(req):
    success = login.update(
        {
            "email":req['email']
        },
        {
            "$set":{
                "name":req['name'], "phone":req['phone'], "dob":req['dob'], 
                "alt_phone":req['alt_phone'], "location":req['location'],
                "gender":req['gender']
            }
        }
    )

    if success['nModified']:
        return True
    else:
        return False

def add_product_to_section(details):
    i = bson.ObjectId()
    success = products.update(
    {
        "section_name":details['section'],
        "Categories.category_name":details['category']
    },
    {
        "$addToSet":{
            "Categories.$.Items":{
                "item_id":i,
                "item_name":details['name'],
                "item_price":details['price'],
                "item_brand":details['brand'],
                "item_qty":details['qty'],
                "item_size":details['size'],
                "item_image":details['images'],
                "colors":details['colors'],
                "item_details":details['details']
            }
        }
    })

    if success['nModified']:
        return True
    else:
        return False

def delete_item_from_db(req):
    success = products.update({
            "section_name":req['section_name'],
            "Categories.category_id":req['category_id'],
            "Categories.Items.item_id":req['item_id']
        },
        {
            "$pull":{"Categories.$.Items":{"item_id":req['item_id']}}
        })

    if success['nModified']:
        return True
    else:
        return False

def add_to_cart(cart_items,grand_total,date,address,email):
    cart_info = []
    count = orders.count()
    order_id = "or_" + str(count + 1)
    success = orders.insert_one(
    {
            "order_id": order_id, 
            "order_date": date, 
            "ordered_items": cart_items,
            "address":address,
            "email":email,
            "grand_total":grand_total,
            "delivered":False
        }
    )
    print(cart_items)
    for i in range(len(cart_items)):
        success1=products.update_many(
            {
                "section_name":cart_items[i]["item_section"],
                "Categories.category_name": cart_items[i]["item_category"],
                "Categories.Items.item_id": cart_items[i]["item_id"]
            },
            {
            "$set":{
                    "Categories.$[updateCategory].Items.$[updateItem].item_qty" : cart_items[i]["prev_item_qty"]-int(cart_items[i]["item_quantity"])
                }
            }, 
            {
                "array_filters": [
                    {"updateCategory.category_name" : cart_items[i]["item_category"]},
                    {"updateItem.item_id" : cart_items[i]["item_id"]}
                ]
        }
        )
    if success.inserted_id:
        flag = True
        print("Here")
    else:
        flag = False

    return flag

def getOrderDetails(email):
    if email == 'all':
        orders_info_cursor = orders.find({}, {"_id":0})
    else:
        orders_info_cursor = orders.find({"email":email}, {"_id":0})
    orders_info = []

    for order in orders_info_cursor:
        orders_info.append(order)
    return orders_info

def change_password(req):
    success = login.update(
    {
        "isAdmin":True,
        "email":req['email']
    },
    {
        "$set":{"password":req['password']}
    })

    if success['nModified']:
        return True
    else:
        return False

def set_order_to_delivery(order_id):
    success = orders.update({
        "order_id":order_id
    },
    {
        "$set":{"delivered":True}    
    })

    if success['nModified']:
        return True
    else:
        return False

def search_product(pattern):
    doc_cursor = products.aggregate([
    {
        "$unwind":"$Categories",
    },
    {
        "$unwind":"$Categories.Items"
    },
    {
        "$match":{
            "Categories.Items.item_name":{"$regex": '.*'+pattern+'.*', "$options":"$i"}
        }
    },
    {
        "$limit":10
    },
    {
        "$project":{
            "Categories.category_name":1,
            "Categories.category_id":1,
            "section_name":1,
            "Categories.Items.item_name":1,
            "Categories.Items.item_id":1,
            "_id":0
        }
    }])

    documents = []
    for doc in doc_cursor:
        documents.append(doc)
    
    return documents
