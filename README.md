# Etherless-cli
Module through which users can interact with the Etherless platform.

# Installation 
Open a terminal and run the command <code>npm i @roundabout-team/etherless-cli -g</code> (Depending on your OS, administrator privileges may be required)

# Commands 
To use a command from inside the repository run: <code>etherless `<command>` [params...]</code>

## Signup 
Command: <code>etherless signup [--save]</code> <br/> 
Will create an Ethereum account for you, and show its: address, private key and mnemonic phrase. You can request to save these informations inside a file of the current directory with the flag <code>--save</code>.

## Login 
Command: <code>etherless login `<private_key>` </code> <br />
It will log the user in an Ethereum wallet with the private key inserted. <br>
A password to encrypt the wallet will be requested after executing this command.

## Logout 
Command: <code>etherless logout</code> <br />
After executing this command all the saved credentials will be deleted. 

## List 
Command: <code>etherless list</code> <br />
After executing this command a list of all functions available in the platform will be shown. 
  
## Info 
Command: <code>etherless info `<function_name>`</code> <br />
After executing this command, all details about the functioin will be shown. 
  
## Run 
Command: <code>etherless run `<function_name>` [params...]</code> <br />
After executing this command, the function result will be shown. 
  
## Deploy 
Command: <code>etherless deploy `<function_name>` `<source_path>` `<description>`</code> <br />
After executing this command a success or error message will be shown.
  
## Delete 
Command: <code>etherless delete `<function_name>`</code> <br />
After executing this command the considered function will be deleted 
  
