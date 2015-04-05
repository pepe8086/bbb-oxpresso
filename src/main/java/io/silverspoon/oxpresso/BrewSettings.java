package io.silverspoon.oxpresso;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.camel.Exchange;

import java.io.File;
import java.io.IOException;

/**
 * Created by ppecka on 2/4/15.
 */
public class BrewSettings {

    //store json - like hashmap
    //private Map<String, Serializable> myMap;


    public BrewSettings() {
       /* this.myMap = new HashMap<>();
        HashMap<String, Serializable> temperatureSettings = new HashMap();

        //degrees of Celsius
        temperatureSettings.put("steam", "125");
        temperatureSettings.put("coffee", "96");
        temperatureSettings.put("tea", "79");
        temperatureSettings.put("sleep", "55");
        temperatureSettings.put("hibernate", "0");
        myMap.get("temperatureSettings");
        myMap.put("temperatureSettings", temperatureSettings);
        */

    }

    public void getCurrentSettings(Exchange exchange) throws IOException {
        //#TODO getresource()
        File file = new File("/home/ppecka/IdeaProjects/bbb-oxpresso/src/main/resources/brewSettings.json");
        //json = new String(readAllBytes(get(file.getAbsolutePath())));
/*
        byte[] mapData = Files.readAllBytes(Paths.get(file.getAbsolutePath()));
        ObjectMapper objectMapper = new ObjectMapper();

        myMap = objectMapper.readValue(mapData, new TypeReference<HashMap<String,String>>() {});
*/
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(file);
        exchange.getOut().setBody(rootNode);
    }

    /*
    persists settings from client into file
    TODO - create method which allows return to default settings (two separate files default and current settings)
     */
    public void updateSettings(Exchange exchange) throws IOException {
        //#TODO getresource()
        File file = new File("/home/ppecka/IdeaProjects/bbb-oxpresso/src/main/resources/brewSettings.json.new");
        //exchange.getIn().getBody();
        ObjectMapper mapper = new ObjectMapper();

        mapper.writeValue(file, mapper.readTree((byte[]) exchange.getIn().getBody()));

    }

    /*
    public Map<String, Serializable> getMyMap() {
        return myMap;
    }

    public void setMyMap(Map<String, Serializable> myMap) {
        this.myMap = myMap;
    }
    */


}
