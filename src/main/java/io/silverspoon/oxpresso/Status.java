package io.silverspoon.oxpresso;

/**
 * Created by ppecka on 1/27/15.
 */
public class Status {

    public Status() {
    }

    public Status(String name, String value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    private String name;
    private String value;
}
