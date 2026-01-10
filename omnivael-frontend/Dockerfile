FROM node:20-alpine
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
WORKDIR /app
COPY package*.json ./
# Copy prisma directory before install because postinstall script needs it
COPY prisma ./prisma/
RUN npm install
COPY . .
# Generate Prisma client before build (redundant if postinstall works, but safe)
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
