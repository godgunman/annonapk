#!/usr/bin/env python

from pprint import pprint

import market_proto
from androidmarket import MarketSession

import sys
import json

if __name__ == "__main__":
    # Start a new session and login
    session = MarketSession()
    session.login("", "")

    # Search for "bankdroid" on the market and print the first result
#    query = raw_input('Please enter a pkg name to search: ')
    query = sys.argv[1]
    results = session.searchApp(query)
    if len(results) == 0:
        print json.dumps({"error": "Application not found."});
        exit()

    apklist = []
    for app in results:
        apk = {}
        apk["version"] = app["version"]
        apk["title"] = app["title"]
        apk["id"] = app["id"]
        apk["packagename"] = app["packagename"]
        apklist.append(apk)
    r = {}
    r["error"] = None
    r["result"] = apklist
    print json.dumps(r)
    exit()

    # Check if pkg name match
    found = 0
    for (i, app) in enumerate(results):
        if query == app["packagename"]:
            print(app["id"])
            found = 1
            break

    if not found:
        print("Which one do you mean?")
        for (i, app) in enumerate(results):
            print(str(i) + ") " + app["packagename"])

#    # Print the last two comments for the app
#    results = session.getComments(app["id"])
#    pprint(results[:2])
#
#    # Download and save the first screenshot
#    data = session.getImage(app["id"])
#    f = open("screenshot.png", "wb")
#    f.write(data)
#    f.close()
#
#    # Download and save the app icon
#    data = session.getImage(app["id"], imagetype=market_proto.GetImageRequest.ICON)
#    f = open("icon.png", "wb")
#    f.write(data)
#    f.close()
#
#    # Get all the categories and subcategories
#    results = session.getCategories()
#    pprint(results)
