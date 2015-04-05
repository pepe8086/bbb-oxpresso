package io.silverspoon.oxpresso;

import org.apache.camel.CamelContext;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.main.Main;
import org.apache.camel.spring.SpringCamelContext;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class CamelMain {

	public static void main(String[] args) throws Exception {
		final ApplicationContext context = new ClassPathXmlApplicationContext(
				new String[] {"META-INF/spring/camelContext.xml"});
		final CamelContext camel = SpringCamelContext.springCamelContext(context);

		final Main main = new Main();
		main.enableHangupSupport();
		main.addRouteBuilder(new RouteBuilder() {

			@Override
			public void configure() throws Exception {
				addRoutesToCamelContext(camel);
			}
		});
		main.run(args);
	}
}
