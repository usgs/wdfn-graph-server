# Use LTS release
FROM node:16-slim

RUN  apt-get update \
    && apt-get install -y gnupg1 \
     # Install latest chrome dev package, which installs the necessary libs to
     # make the bundled version of Chromium that Puppeteer installs work.
     && apt-get install -y wget --no-install-recommends \
     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
     && apt-get update \
     && apt-get install -y google-chrome-stable --no-install-recommends \
     && rm -rf /var/lib/apt/lists/*

# Source will be added here
WORKDIR /wdfn-graph-server

# Add manifest and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Add the server source code
COPY ./src ./src
RUN npm run build:swagger

ENV WDFN_ROOT https://waterdata.usgs.gov/
ENV DEBUG express:*
# Add user so we don't need the --no-sandbox Chrome option
RUN groupadd grapher && useradd -g grapher grapher \
    && mkdir -p /home/grapher/Downloads \
    && chown -R grapher:grapher /home/grapher \
    && chown -R grapher:grapher /wdfn-graph-server
USER grapher

EXPOSE 2929

CMD DEBUG=${DEBUG} WDFN_ROOT=${WDFN_ROOT} node src/app.js