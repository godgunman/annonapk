#!/usr/bin/env python

import androlyze
from androlyze import AnalyzeAPK
import os, sys

apk_session_dir = "session/"
sys.setrecursionlimit(100000)

def read_apk(apk_name, md5):
    """ Read apk file and return a, d, dx """
#     apk_basename = os.path.basename(apk_name)
    apk_session_name = apk_session_dir + md5 + ".apk"

    # mkdir session
    if not os.path.isdir(apk_session_dir):
        os.system("mkdir '{}'".format(apk_session_dir))

    # check if session saved
    if not os.path.isfile(apk_session_name):
        a, d, dx = AnalyzeAPK(apk_name)
        androlyze.save_session([a, d, dx], apk_session_name)
    else:
        a, d, dx = androlyze.load_session(apk_session_name)

    return a, d, dx
