# Private Protests [Post Covid Hack 2020]

Protesting peacefully is a privilege nowadays. When protests start taking place for different causes, a lot of times it is seen that people face friction from government, police and other groups as well. There is no easy way to disseminate information regarding protests to interested participants without revealing the information in public in some form or other. The solutions which are present are also centralised and therefore can't be trusted completely. This is where our project comes in. 

We have built a decentralized private protesting application using Proxy Re-encryption on RSK blockchain. With this application, anyone willing to take part in protests for a particular cause can easily disseminate information to other people interested in protesting in a decentralised and secure manner. All the information is sent to the participants encrypted with their public key and therefore no one else can get access to that information.

We also have a video demo [here.](https://youtu.be/B4Z2ulHdW20)

Here are the steps for installation and testing the project - 

# Installation

```sh
$ git clone https://github.com/riyasingh0799/Post-Covid-Hack-2020.git
$ cd Post-Covid-Hack-2020
$ cd protests-client
$ truffle migrate --network rskTestnet
$ cd ../api
$ npm i
$ cd ../protests-client/protest-organizer
$ npm i
$ cd ../protests-client/protest-attendee
$ npm i
````

# Deploying the Server

Before deploying, run the commands `nuCypher ursula run --dev --federated-only`, `nuCypher alice run --dev --federated-only --teacher 127.0.0.1:10151`, `nuCypher bob run --dev --federated-only --teacher 127.0.0.1:10151 --controller-port 4000` and `nucypher enrico run --policy-encrypting-key <policy-encrypting-key> --http-port 5000` in separate terminals to run the Ursula, Alice, Bob and Enrico nodes.

```sh
$ cd api
$ node server.js
```

# Serving the Application (Organizer)
```sh
$ cd protests-client/protest-organizer
$ npm start
```

# Serving the Application (Attendee)
```sh
$ cd protests-client/protest-attendee
$ npm start
```

And that's it we are good to go. Please feel free to reach out to us with any improvements.


## Contributors 
The project is created by - 
- [Sarang Parikh](https://in.linkedin.com/in/sarang-parikh)
- [Akash](https://in.linkedin.com/in/akash981)
- [Riya Singh](https://in.linkedin.com/in/riya-singh-5aa773193)