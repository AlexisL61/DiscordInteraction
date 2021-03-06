# Discord Interaction

A library that let you use message interaction in your discord.js messages !

## Example

Add a button to a message: 
```js
//Create a MessageInteraction
var messageToSend = new MessageInteraction("Message",message.channel)
//Add a button
messageToSend.addButton("Button",1,"my_button")
//Send the message
channel.send(messageToSend)
```

Add a select menu to a message: 
```js
//Create a MessageInteraction
var messageToSend = new MessageInteraction("Message",message.channel)
//Create an array of options
var menuOptions = [{"label":"First option","value":"first_option","description":"Description for the first option","emoji":{"name":"😄"}}]
//Add the select menu to the message
messageToSend.addSelectMenu("my_select_menu",menuOptions,"My select menu",1,1)
//Send the message
message.channel.send(messageToSend)
```

Await a button to be clicked
```js
    //Create a MessageInteraction
    var messageToSend = new MessageInteraction("Message",message.channel)
    //Add a button
    messageToSend.addButton("Button",1,"my_button")
    //Send the message
    var messageSent = await message.channel.send(messageToSend)
    //Await for the button to be clicked
    var buttonClicked = await MessageInteraction.awaitButtonClicked(messageSent)
    //Receive the data of the button ({"custom_id","component_type"}) and the member who clicked on the button
    console.log(buttonClicked.data,buttonClicked.member)
```

Await a select menu to be clicked
```js
    //Create a MessageInteraction
    var messageToSend = new MessageInteraction("Message",message.channel)
    //Create an array of options
    var menuOptions = [{"label":"First option","value":"first_option","description":"Description for the first option","emoji":{"name":"😄"}}]
    //Add the select menu to the message
    messageToSend.addSelectMenu("my_select_menu",menuOptions,"My select menu",1,1)
    //Send the message
    var messageSent = await message.channel.send(messageToSend)
    //Await for the button to be clicked
    var selectMenuClicked = await MessageInteraction.awaitSelectMenuClicked(messageSent)
    //Receive the data of the button ({"custom_id","component_type","values":[]}) and the member who clicked on the button
    console.log(selectMenuClicked.data,selectMenuClicked.member)
```

Respond to an interaction
```js
    //Create a MessageInteraction
    var messageToSend = new MessageInteraction("Message",message.channel)
    //Add a button
    messageToSend.addButton("Button",1,"my_button")
    //Send the message
    var messageSent = await message.channel.send(messageToSend)
    //Await for the button to be clicked
    var buttonClicked = await MessageInteraction.awaitButtonClicked(messageSent)
    //Respond to the interaction
    MessageInteraction.respondToInteraction(buttonClicked.id,buttonClicked.token)
```