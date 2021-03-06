var MessageInteraction = require("../index.js")
var Discord = require("discord.js")
var client = new Discord.Client()

client.on("ready",()=>{
    console.log(MessageInteraction)
})

client.on("message",async (message)=>{
    if (message.content.startsWith("!test")){
        var messageToSend = new MessageInteraction("Message",message.channel)
        messageToSend.addButton("Button",1,"my_button")

        var menuOptions = [{"label":"First option","value":"first_option","description":"Description for the first option","emoji":{"name":"😄"}}]
        messageToSend.addSelectMenu("my_select_menu",menuOptions,"My select menu",1,1)

        var messageSent = await message.channel.send(messageToSend)
        var buttonClicked = await MessageInteraction.awaitButtonClicked(messageSent)
        console.log(buttonClicked.data,buttonClicked.member)
    }
})

client.login();