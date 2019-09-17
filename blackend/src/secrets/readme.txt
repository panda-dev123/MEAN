Keys
=======
---

## Generating using a website
Generating self signed keys using
E.g.: http://www.csfieldguide.org.nz/en/interactives/rsa-key-generator/index.html


## Generating using own self signed keys
openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt

## For fixing private key (in case of error)
openssl rsa -in key.txt -out key.txt
openssl rsa -in private_key_filename -pubout -outform PEM -out public_key_output_filename


## File formats
Make sure files have following header and footer:
-----BEGIN PUBLIC KEY-----
-----END PUBLIC KEY-----

-----BEGIN RSA PRIVATE KEY-----
-----END RSA PRIVATE KEY-----