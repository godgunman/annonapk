FROM ubuntu:14.04

# apt-get
RUN \
  apt-get update && apt-get install -y \
  curl \
  default-jre

# apktool.jar
curl -L -o /usr/local/bin/apktool.jar https://bitbucket.org/iBotPeaches/apktool/downloads/apktool_2.0.0.jar

ENTRYPOINT ["java", "-jar", "/usr/local/bin/apktool.jar"]
