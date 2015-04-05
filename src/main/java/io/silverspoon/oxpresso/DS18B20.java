package io.silverspoon.oxpresso;

import org.apache.camel.Exchange;

import java.io.File;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by ppecka on 1/24/15.
 */
public class DS18B20 {
    //private static Pattern pattern = Pattern.compile("t=(\\d+)");

    public DS18B20() {

    }

    public void transform(Exchange exchange) {
        String lines[] = exchange.getIn().getBody(String.class).split("\\r?\\n");
        try {
            if (!lines[0].matches(".*crc=.{2}\\s+YES")) {
                System.out.println(lines[0]);
                throw new IOException("ERROR - sensor read with wrong CRC - could not read temperature!");
            }
        } catch (IOException e) {
            System.out.println(e.getMessage());
            exchange.getOut().setBody(e.getMessage());
        }
        try {
            Pattern pattern = Pattern.compile("t=(\\d+)");
            Matcher matcher = pattern.matcher(lines[1]);

            if (matcher.find()) {

                String temp = matcher.group(1);
                StringBuilder output = new StringBuilder();
                output.append(temp.substring(0,temp.length()-3));
                output.append(".");
                output.append(temp.substring(temp.length()-3,temp.length()));

                Status hu = new Status();
                hu.setName(new File(String.valueOf(exchange.getIn().getHeader("CamelFileAbsolutePath"))).getParentFile().getName());
                hu.setValue(output.toString());

                exchange.getOut().setBody(hu);
            } else {
                throw new Exception("ERROR: could not parse sensor temperature value!");
            }

        } catch (Exception e) {
            System.out.println(e.getMessage());
            exchange.getOut().setBody(String.format("Sensor ID: %s - could not read temperature!", "XXXXX"));

        }

    }

    public void getSensorID(Exchange exchange) {
        exchange.getIn().setHeader("DS18B20_ID", new File(String.valueOf(exchange.getIn().getHeader("CamelFileAbsolutePath"))).getParentFile().getName());
    }
}