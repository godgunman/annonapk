FROM ubuntu:14.04

# apt-get
RUN \
  apt-get update && apt-get install -y \
  default-jre
