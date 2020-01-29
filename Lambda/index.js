const AWS = require('aws-sdk') // Package to access AWS Application
const awsIot = require('aws-iot-device-sdk'); // Package to access AWS IoT Platform(MQTT Protocol)

const info = require('./info'); // JSON File with user's identifier in AWS IoT 
const device = awsIot.device({  // User's Things Information 
    keyPath: info.privateKey,
    certPath: info.clientCert,
    caPath: info.caCert,
    clientId: info.clientId,
    region: info.region,
    host: info.hostName,
});

device.subscribe('$aws/things/<Your-Thing-Name>/shadow/update/accepted');
device.subscribe('$aws/things/<Your-Thing-Name>/shadow/get/accepted');

const app_id = "Alexa-Skill-ARN";
var ctx = null;

/*-------------------------------------------------------------
  <Handler Function>
  Event : Alexa Voice Command
    <type>
    "LaunchRequest" : Alexa Invocation Command
    "IntentRequest" : Alexa Custom Command
    "SessionEndedRequest" : Alexa Termination Command
    
    <intent> : Alexa Custom Skill's Intent On own's Situation
    "name" : Its Intent Name
----------------------------------------------------------------*/
exports.handler = function (event, context, callback) {
    try {
        ctx = context;
        if (event.session.application.applicationId !== app_id) {
             ctx.fail("Invalid Application ID");
        }
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }
        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request, event.session, callback);
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request, event.session, callback)
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            ctx.succeed();
        }
    } catch (e) {
        console.log("EXCEPTION in handler:  " + e);
        ctx.fail("Exception: " + e);
    }
};
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
}
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}
function onIntent(intentRequest, session, callback) {
    var intent = intentRequest.intent,
    intentName = intentRequest.intent.name;

    var callback = null;
    // Dispatch to your skill's intent handlers
    if ("Airconditioner_on_Intent" === intentName) {
        Airconditioner_on_Intent(intent, session, callback);
    }
    else if ("Airconditioner_off_Intent" === intentName) {
        Airconditioner_off_Intent(intent, session, callback);
    }
    else {
        throw "Invalid intent";
    }
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}
function getWelcomeResponse() {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to Artilexa";

    var repromptText = "tell your command.";
    var shouldEndSession = false;
    ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));
}
function Airconditioner_on_Intent(intent, session, callback) {
  var repromptText = null;
  var sessionAttributes = {};
  var shouldEndSession = false;
  var speechOutput = "";

  repromptText = "turn on complete";
  var cardTitle = "Airconditioner On"  ;
  speechOutput = "complete turn on" ;
  
  var data = {
    "state": {    
      "desired": {
        "Aircon": "ON"
      },
      "reported": {
        "Aircon": "ON"
      }    
    }
  };
  device.publish('$aws/things/<Your-Thing-Name>/shadow/update', JSON.stringify(data), () => {
    ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));
  })     
}

function Airconditioner_off_Intent(intent, session, callback) {
  var repromptText = null;
  var sessionAttributes = {};
  var shouldEndSession = false;
  var speechOutput = "";

  repromptText = "turn off complete";
  var cardTitle = "Airconditioner Off"  ;
  speechOutput = "complete turn off" ;

  var data = {
    "state": {    
      "desired": {
        "Aircon": "OFF"
      },
      "reported": {
        "Aircon": "OFF"
      }    
    }
  };
  device.publish('$aws/things/<Your-Thing-Name>/shadow/update', JSON.stringify(data), () => {
    ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));
  }) 
}

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
          type: "Simple",
          title: "SessionSpeechlet - " + title,
          content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}