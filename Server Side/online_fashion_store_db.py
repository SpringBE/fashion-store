from pymongo import MongoClient
from pprint import pprint
from datetime import datetime, timedelta
import re

db = MongoClient("mongodb+srv://celestia:celestia0121@cluster0.rbqpa.mongodb.net/fashionstore?retryWrites=true&w=majority")
mydb = db.fashionstore

products = mydb['Products']
login = mydb['login']

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

def sign_in_confirmation(email,password):
    record_count = login.find({'email':email, 'password':password}).count()
    if record_count == 1:
        return True
    else:
        return False

def email_confirmation(email):
    r_count = login.find({'email':email})
    record_count = 0
    for count in r_count:
        record_count = count
    if record_count == 0:
        return False
    else:
        return True

def addUser(name,phone,email,password):
    confirmation = login.insert({'name':name, 'phone':phone, 'email':email, 'password':password})
    if confirmation:
        return True
    else:
        return False