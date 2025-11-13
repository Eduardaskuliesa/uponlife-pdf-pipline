FROM gotenberg/gotenberg:8-cloudrun

USER root

RUN apt-get update && apt-get install -y xz-utils \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://nodejs.org/dist/v20.18.1/node-v20.18.1-linux-x64.tar.xz -o node.tar.xz \
    && tar -xJf node.tar.xz -C /usr/local --strip-components=1 \
    && rm node.tar.xz

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
COPY start.sh /start.sh
RUN chmod +x /start.sh

RUN chown -R gotenberg:gotenberg /app

USER gotenberg

EXPOSE 8080

CMD ["/start.sh"]