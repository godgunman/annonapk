#!/bin/sh

[ ! -n "$1" ] && exit 0

#####
# Initialization
#####
APK_LOCATION=$1;
DIR_NAME=`echo $APK_LOCATION | sed -En 's/\.apk$//p'`

#####
# Translate AndroidManifest file from binary to human readable
#####
#[ ! -f $APK_LOCATION ] && echo File not found. && exit
echo "[0;32m=====> Decode xml(you need install framework first)[0m"
tools/apktool d -f $APK_LOCATION $DIR_NAME

#####
# unzip apk file
#####
echo "[0;32m=====> unzip apk file[0m"
unzip -n $APK_LOCATION -d $DIR_NAME

#####
# dex 2 jar
# Retrieve the classes from dex file
#####
echo "[0;32m=====> dex2jar[0m"
tools/dex2jar/dex2jar.sh "$DIR_NAME/classes.dex" || (echo "[0;31m=====> Classes.dex not exist [0m" && exit)
(cd $DIR_NAME && jar xvf classes_dex2jar.jar)
