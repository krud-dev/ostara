# Internal

Internal service discovery is a self discovery mechanism which allows you to integrate your Spring applications with Ostara via a simple dependency.

{% hint style="danger" %}
This type of service discovery is only supported for **Spring Boot 3** and above, and requires Java 17 and above.
{% endhint %}

## Setup

Add the following dependency to your project:



{% hint style="info" %}
The client dependency goes by the same version as Ostara
{% endhint %}

{% code title="Gradle (Kotlin)" %}
```kotlin
implementation("dev.ostara:spring-client:VERSION")
```
{% endcode %}

{% code title="Gradle (Groovy)" %}
```groovy
implementation 'dev.ostara:spring-client:VERSION'
```
{% endcode %}

{% code title="Maven" %}
```xml
<dependency>
    <groupId>dev.ostara</groupId>
    <artifactId>spring-client</artifactId>
    <version>VERSION</version>
</dependency>
```
{% endcode %}

After adding the dependency, you must set the following configuration:

{% code title="Yaml" %}
```yaml
ostara:
    client:
        agent-url: # The URL of the Agent installed in your environment
        api-key: # The API key defined in the Agent, required if using SSL
        application-name: # The name of the Application to be displayed in Ostara, if not set, defaults to spring.application.name
```
{% endcode %}

{% code title="Properties" %}
```properties
ostara.client.agent-url= // The URL of the Agent installed in your environment
ostara.client.api-key= // The API key defined in the Agent, required if using SSL
ostara.client.application-name= // The name of the Application to be displayed in Ostara, if not set, defaults to spring.application.name
```
{% endcode %}

Finally, add the `@EnableOstaraClient` annotation to any configuration bean:

```java
@EnableOstaraClient
@SpringBootApplication
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
```
