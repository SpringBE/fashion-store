from pymongo import MongoClient
from pprint import pprint
from datetime import datetime, timedelta
import re

db = MongoClient("mongodb+srv://celestia:celestia0121@cluster0.rbqpa.mongodb.net/fashionstore?retryWrites=true&w=majority")
mydb = db.fashionstore

products = mydb['Products']

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