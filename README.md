# IoT by Voice With AWS Platform

This Program FOR
          
          IoT by Voice With AWS Platform

Process 
          
          Alexa - "Voice Command" 
          
          Lambda - "IoT-Core Shadow" Info Updating Function By Alexa Event 
          
          IoT Core - "Shadow Manage"  
          
          End Device - "Actual Device like Aircon,TV Control"  RaspberryPi

Needed
          
          1. you must interlock AWS IoT core and End Device for pem.key, root key, cert.key 
          
          2. Alexa Skill build (just make up to your taste)
          
          3. Control device by raspberrypi gpio IR sensor(So you need IR Protocol about device that you want to control)
          
          4. Echo(Amazon Smart Speaker) 
          
          *You can use Alexa console if you don't have Echo device 
Code
          
          1. index.js - Lambda function Code(Node.js)
          
          info.json : Your AWS IoT information
          
          2. Rapberry.js - Code in Raspberry(Node.js) for shadow info 'get' and control IR Sensor on Situation
Package 
          
          1. aws-iot-device-sdk : Package to access AWS IoT Platform(MQTT Protocol)
          
          2. child_process : Execute other program by producing new child process
          

More Information on the Code

