#!/usr/bin/env python

from androguard.decompiler.dad import decompile
from dm4 import read_apk
import sys, hashlib, os, errno, json

# Global variables
base_dir = os.path.dirname(__file__)
if base_dir is "":
    base_dir = os.getcwd()
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
    return getAPKInformationJson(a, d)

def apktoolAnalyze(f_name, f_md5):
    from subprocess import call
    dir_name = APK_ROOT + "/analytics/" + f_md5 + "/"
    call(["/home/atdog/jdk1.7.0_45/bin/java", "-jar", base_dir + "/apktool.jar", "d", "-f", f_name, dir_name])

def getAPKInformationJson(a, d):
    result = {}
    result['package'] = a.get_package()
    result['class_count'] = len(d.get_classes())
    result['method_count'] = len(d.get_methods())
    result['permissions'] = a.get_permissions()
    result['activities'] = a.get_activities()
    result['providers'] = a.get_providers()
    result['services'] = a.get_services()
    result['receivers'] = a.get_receivers()
    result['max_sdk_version'] = a.get_max_sdk_version()
    result['min_sdk_version'] = a.get_min_sdk_version()
    return json.dumps(result)

def main():
    if len(sys.argv) != 2:
        print sys.argv[0],"apk_name"
        sys.exit(1)
    
    f_name = sys.argv[1]
    f_md5 = md5Checksum(sys.argv[1]);

    try:
        dir_name = APK_ROOT + "/analytics/" + f_md5 + "/"
        if os.path.exists(dir_name): 
            a, d, dx = read_apk(f_name, f_md5)
            result = getAPKInformationJson(a, d)
            print '{"result":"Analytics already exist.", "apk_info":%s}' % result
            sys.exit(1)
        # force to delete directory by command (apktool d -f )
        apktoolAnalyze(f_name, f_md5)
        result = androguardAnalyze(f_name, f_md5)
        print '{"result":"Done.", "apk_info":%s}' % result
    except SystemExit:
        pass
    except:
        sys.stderr.write("Unexpected error: %s\n" % sys.exc_info()[0])
        print '{"result":"Parse Error."}'

if __name__ == "__main__":
    main()
