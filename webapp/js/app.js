$(document).ready(function () {


    /* var supported = ("WebSocket" in window);
     if (!supported) {
     var msg = "Your browser does not support Web Sockets. This example will not work properly.<br>";
     msg += "Please use a Web Browser with Web Sockets support (WebKit or Google Chrome).";
     $("#connect").html(msg);
     }
     */
    var serverAddress = "127.0.0.1";
    var sensors = {};
    //mqttclient reference
    var client;
    var timerId;
    ClientSettings = "";

    function connectMQTT() {
        var r = Math.round(Math.random() * Math.pow(10, 5));
        var d = new Date().getTime();
        var cid = r.toString() + "-" + d.toString();

        client = new Messaging.Client(serverAddress, 61614, cid);
        client.onConnect = onConnect;
        client.onMessageArrived = onMessageArrived;
        client.onConnectionLost = onConnectionLost;
        client.connect({onSuccess: onConnect, onFailure: onFailure});
        return 0;
    }

    function doDisconnect() {
        client.disconnect();
        $('#status').toggleClass('label-success', false);
        $('#status').toggleClass('label-warning', true);
        $('#status').toggleClass('label-danger', false);
        $('#status').text('Disconnected');
    }

    var onSuccess = function (frame) {

    };


    var onConnect = function (frame) {
        $('#status').toggleClass('label-success', true);
        $('#status').toggleClass('label-warning', false);
        $('#status').toggleClass('label-danger', false);
        $('#status').text('Connected');
        clearInterval(timerId);

        client.subscribe("currentTemp");
        client.subscribe("brewStatus");

        sendBrewCommand("getCurrentSettings");
    };

    var onFailure = function (error) {
        $('#status').toggleClass('label-success', false);
        $('#status').toggleClass('label-warning', false);
        $('#status').toggleClass('label-danger', true);
        $('#status').text("Failure");
        mqttReconnect();
    };

    function onConnectionLost(responseObject) {
        $('#status').toggleClass('label-success', false);
        $('#status').toggleClass('label-warning', true);
        $('#status').toggleClass('label-danger', false);
        $('#status').text('Connection lost');
        mqttReconnect();
    }

    function mqttReconnect() {
        timerId = setInterval(connectMQTT(), 1000);
    }

    //get default Temp settings
    function init() {
        connectMQTT();
        $("#top-navbar li.active").trigger("click");
    }


    function updateTemperature(message) {
        var obj = JSON.parse(message.payloadString);

        //TODO: change title,label - update Status bean
        if (sensors[obj.name] == null) {
            $('#brew').append('<div id="' + obj.name + '" class="gauge col-xs-4"/>');
            //$('#settings').append('<div class="col-xs-4 input-group">'+obj.name+'<span id=span-' + obj.name +' class="badge">50</span><input onchange="sliderChange(this.value)" id=input-' + obj.name +' type="range" class="slider" min="0" max="100" value="50" step="1" /></div>');
            //$('#settings').append('<input type="range" min="0" max="50" value="0" step="5" onchange="showValue(this.value)" /><span id="range">0</span>');
            console.log("updateTemperature message: " + obj.value);

            sensors[obj.name] = new JustGage({
                id: obj.name,
                value: obj.value,
                min: 0,
                max: 135,
                title: obj.name,
                label: "°C"
            });
        } else {
            sensors[obj.name].refresh(obj.value);
        }
    }

    // getCurrentSettings - get espresso machine current settings
    // #espresso - warm-up
    // #steam - warm-up
    // #tea - warm-up
    function sendBrewCommand(command) {
        message = new Messaging.Message(command);
        message.destinationName = 'brewCommands';
        client.send(message);
    }


    //incomming message dispatcher
    function onMessageArrived(message) {

        if (message.destinationName == "currentTemp") {
            updateTemperature(message);
        } else if (message.destinationName == "brewStatus") {
            updateClientSettings(message);
        } else {
            console.log("UNKNOWN MESSAGE SOURCE: " + message.destinationName);
        }

    }

    function updateClientSettings(message) {
        var obj = JSON.parse(message.payloadString);
        //var cloned = JSON.parse(message.payloadString);

        if( ! ClientSettings.length > 0) {
            ClientSettings = JSON.parse(message.payloadString);
            console.log("HU" + ClientSettings);
        } else {
           console.log("HUGO " + ClientSettings);
        }

        console.log("updateSettings message: " + message.payloadString);
        console.log("updateSettings message: " + obj.temperatureSettings.coffee.value);
        console.log("updateSettings message: " + obj.temperatureSettings.steam.value);
        console.log("sensorMapper message: " + obj.sensorMapper.boilerTemp);


        var $tempSettings = $("#temperatureSettings");

        //create range sliders
        for (var k in obj.temperatureSettings) {
            if (obj.temperatureSettings.hasOwnProperty(k)) {
                var selectedNodeName = "temperatureSlider" + k;
                var $selectedNode = $tempSettings.find('#' + selectedNodeName);

                if ($selectedNode.length > 0) {
                    $selectedNode.find('input').val(obj.temperatureSettiungs[k].value);
                } else {
                    $tempSettings.append(
                        $('<li></li>').attr("id", selectedNodeName).text(k).append(
                            $('<input />',obj.temperatureSettings[k])
                        )
                    );

                    //rangesliders
                    $('input[type="range"]').rangeslider({
                        polyfill: false,
                        // Default CSS classes
                        rangeClass: 'rangeslider',
                        fillClass: 'rangeslider__fill',
                        handleClass: 'rangeslider__handle',
                        // Callback function
                        onInit: function () {
                        },

                        // Callback function
                        onSlide: function (position, value) {
                            console.log("slider:" + value);
                        },

                        // Callback function
                        onSlideEnd: function (position, value) {
                            //cloned.temperatureSettings[k].value = value;
                            ClientSettings.temperatureSettings[k].value = value;
                            //console.log("origo:" + JSON.stringify(obj, null, 2));
                            //console.log("cloned:" + JSON.stringify(ClientSettings, null, 2));
                        }
                    });
                }
            }
        }

    }

/*
    $('#settings').on('click', function () {
        sendBrewCommand("getCurrentSettings");
    });
*/
    $('.brewCommands').on("click", function () {
        var message = $(this).attr('href');
        console.log("message " + message);
        sendBrewCommand(message);
    });


    //connect to Messae broker
    $('#status').on('click', function () {
        connectMQTT();
    });

    //Activate navbar
    $('#top-navbar>li').on("click", function activateMenu(event) {
        $('#top-navbar li').removeClass('active');
        $(this).addClass('active');
        var activateContent = $(this).find('a:first').attr('href');
        $('.content-toggle').hide();
        $('.content-toggle' + activateContent).show();
    });

    $("[href=#settingsUpdate]").on("click", function (event){
        console.log("clicked #settingsUpdate");
        var message = JSON.stringify(ClientSettings);
        console.log("message " + message);
        sendBrewCommand(message);
    });

    $("[href=#settingsDiscard]").on("click", function (event){
        console.log("clicked #settingsDiscard");
        ClientSettings.current = "";
    });


    $('.nav li a').on('click', function() {
        $(this).parent().parent().find('.active').removeClass('active');
        $(this).parent().addClass('active').css('font-weight', 'bold');
    });

    //rangesliders

    $('input[type="range"]').rangeslider({

        // Feature detection the default is `true`.
        // Set this to `false` if you want to use
        // the polyfill also in Browsers which support
        // the native <input type="range"> element.
        polyfill: false,

        // Default CSS classes
        rangeClass: 'rangeslider',
        fillClass: 'rangeslider__fill',
        handleClass: 'rangeslider__handle',

        // Callback function
        onInit: function () {
        },

        // Callback function
        onSlide: function (position, value) {
        },

        // Callback function
        onSlideEnd: function (position, value) {
        }
    });


    init();
})
