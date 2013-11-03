AnnonaPK API
============

AnnonaPK is an API service to search / download / analyze .apk files!

Analyze Apk
-----------

Extract information from given .apk file.

    POST /api/apk/analyze

Search Apk
----------

Search apps on Google Play.

    GET /api/apk/search?q=[app_to_search]

Download Apk
------------

Download .apk file from Google Play of given id.

    GET /api/apk/download?id=[app_id_to_download]
