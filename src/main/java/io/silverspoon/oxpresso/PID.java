package io.silverspoon.oxpresso;

import org.apache.camel.BeanInject;
import org.apache.camel.Exchange;

/**
 * Created by ppecka on 2/6/15.
 */
public class PID {

    private String command;
    @BeanInject("BrewSettings")
    BrewSettings brewSettings;

    public PID() {
        this.command = "#hibernate";
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public void runCommand(Exchange exchange) {
        setCommand(exchange.getIn().getBody(String.class));
        System.out.println("Current command: " + this.getCommand());
    }

    public void controllLoop(Exchange exchange) {
        //System.out.println("Controll Loop: " + exchange.getIn().getHeader("fireTime"));
        /*HashMap<String, Serializable> myMap = (HashMap<String, Serializable>) this.brewSettings.getMyMap();
        HashMap<String, Serializable> subMap = (HashMap < String, Serializable >)myMap.get("temperatureSettings");
                String val = (String)subMap.get("coffee");
        System.out.println("controllLoop: " + val );
*/
        System.out.println("controllLoop: " );
        //loop HashMap
        /*
		for (Entry<Dog, Integer> entry : hashMap.entrySet()) {
			System.out.println(entry.getKey().toString() + " - " + entry.getValue());
		}
		*/
    }

}
