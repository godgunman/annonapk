#!/usr/bin/env python

from androguard.decompiler.dad import decompile
from dm4 import read_apk
import sys, hashlib, os, errno

# Global variables
base_dir = os.path.dirname(__file__)
APK_ROOT = base_dir + "/../apk/"

def md5Checksum(filePath):
    with open(filePath, 'rb') as fh:
        m = hashlib.md5()
        while True:
            data = fh.read(8192)
            if not data:
                break
            m.update(data)
        return m.hexdigest()

def mkdir_p(path):
    try:
        os.makedirs(path)
    except OSError as exc: # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else: 
            raise

def decompileMethod(dx, method):
    mx = dx.get_method(method)

    ms = decompile.DvMethod(mx)
    # process to the decompilation
    ms.process()

    # get the source !
    return ms.get_source()

def androguardAnalyze(f_name, f_md5):
    a, d, dx = read_apk(f_name, f_md5)

    for current_class in d.get_classes():
        path = current_class.get_name()[1:-1]
        dir_name = APK_ROOT + "/analytics/" + f_md5 + "/src/" + os.path.dirname(path) + "/"
        src_name = dir_name + os.path.basename(path) + ".java"
        # create dir
        mkdir_p(dir_name)
        # dump source code
        for method in current_class.get_methods():
            if method.get_code() == None:
                continue

            with open(src_name, "ab") as f:
                f.write("// " + method.get_class_name() + "->" + method.get_name() + method.get_descriptor() + "\n")
                f.write(decompileMethod(dx, method))

def apktoolAnalyze(f_name, f_md5):
    from subprocess import call
    dir_name = APK_ROOT + "/analytics/" + f_md5 + "/"
    call(["/home/atdog/jdk1.7.0_45/bin/java", "-jar", base_dir + "/apktool.jar", "d", "-f", f_name, dir_name])

def main():
    if len(sys.argv) != 2:
        print sys.argv[0],"apk_name"
        sys.exit(1)
    
    f_name = sys.argv[1]
    f_md5 = md5Checksum(sys.argv[1]);

    dir_name = APK_ROOT + "/analytics/" + f_md5 + "/"
    if os.path.exists(dir_name): 
        print "analytics already exist."
        sys.exit(1)
    # force to delete directory by command (apktool d -f )
    apktoolAnalyze(f_name, f_md5)
    androguardAnalyze(f_name, f_md5)

if __name__ == "__main__":
    main()
