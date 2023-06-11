# Quick Start

### Download and Installing Ostara

In order to download and install Ostara, head to the [Latest Release](https://github.com/krud-dev/boost/releases/latest) on GitHub and download the binary for the platform of your choice.

### Demo

Ostara contains an in-app demo, the demo allows you to play around with a preconfigured, live Spring Boot application with Actuator and see most of the features Ostara has to offer. Read more on how to start the demo in [in-app-demo.md](../features/in-app-demo.md "mention")

### Usage

In order to use Ostara you must have a running and accessible Spring Boot application with Actuator.

Spring Boot, by default, does not expose most Actuator endpoints. While Ostara can work even in these minimal conditions, we recommend that you expose your actuator like so:

```
management.endpoints.web.exposure.include=*
management.endpoint.health.show-details=always
```

If your Actuator endpoints are protected, you may apply these authentication settings when creating your application in Ostara. For more information, see [authentication-settings](../documentation/authentication-settings/ "mention").

Once your instance is ready, head to [creating-updating-instances.md](../documentation/instances/creating-updating-instances.md "mention").
