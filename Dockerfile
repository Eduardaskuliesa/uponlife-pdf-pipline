FROM node:20-alpine

# Install Chromium and dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-emoji

# Tell Puppeteer where Chromium is
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser


WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]