var awsIot = require('aws-iot-device-sdk');
var info = require('./info');
var exec = require('child_process').exec;

const device = awsIot.device({
    keyPath: info.privateKey,
    certPath: info.clientCert,
    caPath: info.caCert,
    clientId: info.clientId,
    region: info.region,
    baseReconnectTimeMs: 4000,
    protocol: 'mqtts',
    host: info.hostName,
    debug: false
});

device.subscribe('$aws/things/MyRaspberryPi/shadow/update/accepted');

device.on('connect', function() {
    device.publish('$aws/things/MyRaspberryPi/shadow/get','{}');
    console.log('[ Device Connected ]');
});

device.on('message', function(topic, payload) {
    var pay__load = JSON.parse(payload.toString());
    console.log('[ message arrived ]');
    console.log('pay_load : ', pay__load.state.reported);
    var pay = pay__load.state.reported

    if (pay.act == 'aircon') {
        if(pay.aircon == 'on'){
            exec('./IR_ON', (err, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);

                if(err) console.log(`err : ${err}`);
            });
        }
        else if(pay.aircon == 'off'){
            exec('./IR_OFF', (err, stdout, stderr) => {
                console.log(stdout);
                console.log(stderr);

                if(err) console.log(`err : ${err}`);
            });
        }
    }
});

