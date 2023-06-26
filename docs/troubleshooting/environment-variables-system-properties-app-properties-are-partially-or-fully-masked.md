# Environment variables / System properties / App properties are partially or fully masked

In some cases, the values we get back from Actuator are intentionally masked and get sent back as **\*\*\*\*\*\*.** This is caused by configuration on the service end.

&#x20;

<figure><img src="../.gitbook/assets/image (29) (1).png" alt=""><figcaption><p>Example of a heavily redacted System Properties</p></figcaption></figure>

### Spring Boot 2.X

Spring Boot 2.X masks keys with the following patterns by default:

* `password`
* `secret`
* `key`
* `token`
* `.*credentials.*`
* `vcap_services`

These patterns can be set using the following properties ([Reference](https://docs.spring.io/spring-boot/docs/1.5.22.RELEASE/reference/html/howto-actuator.html#howto-sanitize-sensible-values)):

* `endpoints.configprops.keys-to-sanitize=comma,delimited,list`&#x20;
* `endpoints.env.keys-to-sanitize=comma,delimited,list`

### Spring Boot 3.X

In Spring Boot 3.X, all values are masked by default. If this behavior is not desired, it can be controlled using by setting the following properties to either `always`  (Not recommended) or `when-authorized` and setting Ostara to authenticate with your application ([Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties)):

* `management.endpoint.configprops.show-values={always|when-authorized|never}`
* `management.endpoint.env.show-values={always|when-authorized|never}`&#x20;

