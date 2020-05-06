# Etherless-cli
Module through which users can interact with the Etherless platform.

# Installation 
- Download this repo 
- From inside of the downloaded repo run the command <code>npm install</code> to install all the missing dependecies. Then run the command <code>npm link</code> <b>as Administrator</b> (which allow you to use the keyword 'etherless' to execute commands).

# Commands 
To use a command from inside the repository run: <code>etherless `<command>` [params...]</code>

## Signup 
Command: <code>etherless signup [--save]</code> <br/> 
Will create an Ethereum account for you, and show its: address, private key and mnemonic phrase. You can request to save these informations inside a file of the current directory with the flag <code>--save</code>.

## Login 
Command: <code>etherless login `<private_key>` </code> <br />
It will log the user in an Ethereum wallet with the private key inserted. <br>
A password to encrypt the wallet will be requested after executing this command.

## Run 
Command: <code>etherless run `<function_name>` [params...]</code> <br />
After executing this command, the function result will be shown. 
