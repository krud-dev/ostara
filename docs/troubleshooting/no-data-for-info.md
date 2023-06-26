# No data for Info

Some applications may not return any info contributors, resulting in an empty page.

This can be caused by a couple of reasons:

1. The `info` endpoint is not exposed, this can be solved by exposing `info` or adding `info` to an existing exposure using the `management.endpoints.web.exposure.include` property.&#x20;
   1. Example: `management.endpoints.web.exposure.include=info`
2. No info contributors exist. Some default info contributors can be enabled:
   1. [JavaInfoContributor](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/info/JavaInfoContributor.html) - enabled using `management.info.java.enabled=true`
   2. [OsInfoContributor](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/info/OsInfoContributor.html) - enabled using `management.info.os.enabled=true`

Additionally, you may also generate the build information for your application, which will enable the [BuildInfoContributor](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/info/BuildInfoContributor.html) and pass the git information to your application, which will enable the [GitInfoContributor](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/actuate/info/GitInfoContributor.html). Instructions on how to do that can be found [here](https://www.springcloud.io/post/2022-03/spring-boot-info-endpoint/#gsc.tab=0)
