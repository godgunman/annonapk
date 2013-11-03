#!/bin/sh

JAVAPATH=/home/atdog/jdk1.7.0_45/bin/

cd $(dirname $0)
$JAVAPATH/java -cp .:com.gc.android.market.api.jar:com.google.protobuf.jar Download $1 $2
