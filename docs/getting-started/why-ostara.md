# Why Ostara

### Why Ostara?

The first question to ask is _why_ even use Ostara, when excellent tools such as Spring Boot Admin already exist?

As Spring Boot Admin users, we had to ask ourselves this question before embarking on the development journey of Ostara. For all its greatness, one thing Spring Boot Admin that cannot be said about Spring Boot Admin is that it's plug and play or 'off-the-shelf'.

There are two components to consider when implementing Spring Boot Admin in your ecosystem;

#### THE SERVER

To setup Spring Boot Admin, we start by having to create Spring project for the server itself (In our case, which is true for many, also meant we have to setup a full CI/CD flow, complete with Helm charts and Docker images in order to create a full production flow)

If we needed additional features such as authentication, notifications and so on, we would need to add them [directly to the project](https://www.baeldung.com/spring-boot-admin). All of this, despite the infinite versatility it offers (because it is essentially a blank slate), raises the startup costs of Spring Boot Admin _considerably_.&#x20;

Even more so when you remember that you have to continually maintain this project as with any other project within your code ecosystem, either due to security updates to unrelated dependencies you may have needed to add, or in order to update Spring to match your main project(s)

But aren't there ready-made images of Spring Boot Admin Server? A quick Google search will show a few (often outdated) pre-built ones that people in the community have created for different scenarios, including this official [codecentric/spring-boot-admin](https://hub.docker.com/r/codecentric/spring-boot-admin) Docker image which states:

> This repository contains pre-build Docker Images containing basic and hence not production-ready builds of Spring Boot Admin.

#### THE CLIENT

In order to register instances on Spring Boot Admin, you have to add the `spring-boot-admin-starter-client` dependency to your app and point it at the admin server. From personal production experience in mature projects, this isn't always a pleasant, straightforward experience.

If your project guards Actuator's endpoints with Spring Security, you also have to configure the client to send the server the credentials it will need when registering itself.

Alternatively, if you use Spring Cloud Discovery within your ecosystem you will be able to use that in order to discover instances, dependency free, but not hassle free, as you will again have to add this to your server's project and configure on both ends.

