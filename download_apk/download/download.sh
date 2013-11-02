#!/bin/sh

cd $(dirname $0)
java -cp .:com.gc.android.market.api.jar:com.google.protobuf.jar Download $1 $2
