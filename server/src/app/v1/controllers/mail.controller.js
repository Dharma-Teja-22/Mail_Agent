import { GoogleGenerativeAI } from "@google/generative-ai";
import readlineSync from "readline-sync";
import { sendMail, getMailAddress } from "./tools.js";
import dotenv from "dotenv";

dotenv.config();

export function mailControllerTest()
{
    console.log("Testing mail contoller is working fine...!");
    return {
        status:200,
        msg:"Testing..."
    }
}

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "You are a Mail sending AI aaistant with PLAN, ACTION, OBSERVATION and OUTPUT states. You are a profesional at sending mails based on users requirement. You must be in one of the states based on the previous state.\n- when you recieve a users input, analyse it and extract the need of the user and make a plan\n- next execute the action with the available tools provided\n- observation is the result of the function\n- return the generated mail in the format provided in the example strictly\n- finallly return the output\n\n\nAvailable tools : \nsendMail([email : string, subject : string, content : string]) sends the mail by taking recipient mail, subject and content as arguments\ngetMailAddress(designationOrName : string) get the email address of a person by designation or name\n\nExample :\n{\"type\" : \"user\" , \"user\" : \"I want to apply leave on next Friday due to vacation\" }\n{\"type\" : \"plan\", \"plan\" : \"I will fetch exact date for next friday. It is 10th, Jan. so i need to aply leave on this day. Next I understand that user wants leave for vacation, so the reason is vacation. Based on the reason the mail needs to be send to manager and keep HR in cc. First i need to get the email of manager\"}\n{\"type\" : \"action\", \"function\" :\"getMailAddress\",\"input\":\"manager\" }\n{\"type\":\"obeservation\",\"observation\" : \"manasa@gmail.com\"}\n{\"type\":\"plan\", \"plan\":\"Now I have the manager's email. Next, I will get the HR's email to add them in CC.\"}\n{\"type\":\"action\", \"function\": \"getMailAddress\", \"input\":\"HR\"}\n{\"type\":\"observation\",\"observation\":\"hr@gmail.com\"}\n{\"type\" : \"plan\" ,\"plan\" : Now I got the recipients address(manager and HR). next I need to send the mail to recipients\"}\n{\"type\" : \"action\", \"function\" :\"sendMail\",\"input\":[\"recipent mail, cc, subject, mail content\"] }\n{\"type\":\"obeservation\",\"observation\" : \"1234\"}\n{\"type\" : \"output\" , \"output\" : \"Mail send successfully\" } \n\nstrictly exist in only one of the state. Dont generate all the states at a time. ",
});

var messages = [];

const tools = {
  sendMail,
  getMailAddress
}

const generationConfig = {
  temperature: 2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function run(user_input) {
  const chatSession = model.startChat({
    generationConfig,
    history: messages
  });

  const result = await chatSession.sendMessage(user_input);
//   console.log(result.response.text())
  return JSON.parse(result.response.text())
}

async function main(input){
    // const input = readlineSync.question();
    var result = await run(input);
    
    messages.push({
      role: "model",
      parts: [
        {text: JSON.stringify(result)},
      ]
    });
    
  
    while(true){
    //   console.log(1)
      result = await run("next state");
    //   console.log(result);
  
      if(result.type === "action"){
        const fn = tools[result.function];
        const input = result.input;
        const observation = await fn(input);
        messages.push({
          role: "model",
          parts: [
            {text: JSON.stringify({"type":"obeservation","observation" : observation})},
          ]
        })
      }
      
      else if(result.type === "output"){
        messages.push({
          role: "model",
          parts: [
            {text: JSON.stringify(result)},
          ]
        })
        return{
            status:200,
            msg:"Email sent successfully..."
        }
        // break;
      }
  
      else{
        messages.push({
          role: "model",
          parts: [
            {text: JSON.stringify(result)},
          ],
        })
      }
    }    
  }

  export async function mailController(req, res) {
    try {
        const { input } = req.body;
        const response = await main(input);
        if (response.msg === 'Email sent successfully...' && response.status === 200) {
            return res.status(200).json({
                status: 200,
                msg: response.msg
            });
        } else {
            return res.status(500).json({
                status: 500,
                msg: "Something went wrong"
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            msg: "Internal Server Error"
        });
    }
}
