FROM node

WORKDIR /contactsBook

# COPY . /contactsBook/
# or the same.... 
COPY . .

RUN npm install

EXPOSE 8000

CMD [ "node", "server" ]
