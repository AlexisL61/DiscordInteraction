import axios from "axios";
import { APIMessage, Channel, Message, MessageTarget } from "discord.js";
import EventEmitter from "events";

class MessageInteraction extends APIMessage {
    private buttons:Array<object> = []

    /**
     * A Message that let use Interaction
     * @param message The message that will be sent
     * @param channel Where the message will be sent
     */
    constructor(message:string,channel:MessageTarget){
        super(channel,{})
        this.data = {}
        this.data["content"] = message
    }
    
    /**
     * Add a button to a message
     * @param label Text in the button
     * @param style Color of the button (1: blurple, 2: grey, 3: green, 4: red)
     * @param custom_id Id of the button
     * @param disabled If the button is disabled or not
     */
    public addButton(label:string,style:number,custom_id:string,disabled?:boolean){
        if (!this.data["components"]){
            this.data["components"] = [{
                type:1,
                components:[]
            }]
        }
        if (this.data["components"][this.data["components"].length-1].components.length==5 || (this.data["components"][this.data["components"].length-1].components[0] && this.data["components"][this.data["components"].length-1].components[0].type==3)){
            this.data["components"].push({
                type:1,
                components:[]
            })
        }
        this.data["components"][this.data["components"].length-1]["components"].push({label:label,style:style,type:2,custom_id:custom_id,disabled:!disabled?false:true})
    }

    /**
     * Add a Select menu to the message
     * @param custom_id Id of the Select menu
     * @param options Options available in this Select menu
     * @param placeholder Text on the Select menu
     * @param min_values The minimum number of values to select
     * @param max_values The maximum number of values to select
     */
    public addSelectMenu(custom_id:string,options:Array<{"label":string,"value":string,"description"?:string,"emoji"?:{"id"?:string,"name"?:string}}>,placeholder:string,min_values:number,max_values:number){
        if (!this.data["components"]){
            this.data["components"] = [{
                type:1,
                components:[]
            }]
        }
        if (this.data["components"][this.data["components"].length-1]["components"] != 0){
            this.data["components"].push({
                type:1,
                components:[]
            })
        }
        this.data["components"][this.data["components"].length-1]["components"].push({type:3,custom_id:custom_id,options:options,placeholder:placeholder,min_values:min_values,max_values:max_values})
        
    }

    /**
     * Set an embed on the message
     * @param embed An embed object
     */
    public setEmbed(embed:object){
        this.data["embed"] = embed
    }

    /**
     * Wait for a button to be clicked
     * @param message The message containing the button
     * @param timeout The timeout to wait before stop waiting for a button to be clicked
     * @returns A button data
     */
    public static awaitButtonClicked(message:Message,timeout?:number):Promise<{status:number,data:{custom_id:string,component_type:2},token:string,id:string,member:any}>{
        return new Promise((resolve, reject) => {
            var thisListener = (json)=>{
                if (json.message.id == message.id && json.data.component_type==2){
                    message.client.ws.removeListener("INTERACTION_CREATE",thisListener)
                    resolve({"status":0,"data":json.data,"token":json.token,"id":json.id,"member":json.member})
                }
            }
            if (timeout){
                setTimeout(()=>{resolve({"status":1,"data":undefined,"token":undefined,"id":undefined,"member":undefined})},timeout)
            }
            message.client.ws.addListener("INTERACTION_CREATE",thisListener)
        });
    }
    
    /**
     * Wait for a select menu to be clicked
     * @param message The message containing the select menu
     * @param timeout The timeout to wait before stop waiting for a select menu to be clicked
     * @returns A select menu data
     */
    public static awaitSelectMenuClicked(message:Message,timeout?:number):Promise<{status:number,data:{custom_id:string,component_type:3,values:Array<string>},token:string,id:string,member:any}>{
        return new Promise((resolve, reject) => {
            var thisListener = (json)=>{
                if (json.message.id == message.id && json.data.component_type==3){
                    message.client.ws.removeListener("INTERACTION_CREATE",thisListener)
                    resolve({"status":0,"data":json.data,"token":json.token,"id":json.id,"member":json.member})
                }
            }
            if (timeout){
                setTimeout(()=>{resolve({"status":1,"data":undefined,"token":undefined,"id":undefined,member:undefined})},timeout)
            }
            message.client.ws.addListener("INTERACTION_CREATE",thisListener)
        });
    }

    /**
     * Create a listener to wait buttons or select menus to be clicked 
     * @param message The message containing a component
     * @returns An event emitter
     */
    public static addListener(message:Message):EventEmitter{
        var eventEmitter = new EventEmitter();
        var thisListener = (json)=>{
            if (json.message.id == message.id){
                if (json.data && json.data.component_type==2){
                    eventEmitter.emit("button_clicked",{"status":0,"data":json.data,"token":json.token,"id":json.id,"member":json.member})
                }
                if (json.data && json.data.component_type==3){
                    console.log(json)
                    eventEmitter.emit("Select menu_clicked",{"status":0,"data":json.data,"token":json.token,"id":json.id,"member":json.member})
                }
            }
        }
        eventEmitter.on("end",()=>{
            eventEmitter.removeAllListeners()
        })
        message.client.ws.addListener("INTERACTION_CREATE",thisListener)
        return eventEmitter

    }

    /**
     * Respond to an interaction
     * @param interaction_id Id of an interaction
     * @param interaction_token Token of an interaction
     */
    public static respondToInteraction(interaction_id:string,interaction_token:string){
        axios.post("https://discord.com/api/v8/interactions/"+interaction_id+"/"+interaction_token+"/callback",{"type":6})
    }
}

module.exports = MessageInteraction