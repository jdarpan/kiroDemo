#!/bin/bash

echo "Installing Maven..."

# Download Maven
MAVEN_VERSION=3.9.6
MAVEN_URL="https://dlcdn.apache.org/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz"

cd /tmp
curl -O $MAVEN_URL
tar xzf apache-maven-${MAVEN_VERSION}-bin.tar.gz
sudo mv apache-maven-${MAVEN_VERSION} /opt/maven

# Create symlink
sudo ln -sf /opt/maven/bin/mvn /usr/local/bin/mvn

echo "Maven installed successfully!"
mvn -version
