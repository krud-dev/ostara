# Abilities

### Overview

Abilities are essentially feature toggles for your instances. Most features condition their usability on one or more abilities.

Ostara automatically detects all available abilities for a given instance using the conditions set out below.&#x20;

### Abilities

| Ability                 | Condition                                                                                                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Metrics                 | Endpoint `/metrics` exists and is accessible                                                                                                                                                        |
| Env                     | Endpoint `/env` exists and is accessible                                                                                                                                                            |
| Beans                   | Endpoint `/beans` exists and is accessible                                                                                                                                                          |
| Quartz                  | Endpoint `/quartz` exists and is accessible                                                                                                                                                         |
| Flyway                  | Endpoint `/flyway` exists and is accessible                                                                                                                                                         |
| Liquibase               | Endpoint `/liquibase` exists and is accessible                                                                                                                                                      |
| Loggers                 | Endpoint `/loggers` exists and is accessible                                                                                                                                                        |
| Caches                  | Endpoint `/caches` exists and is accessible                                                                                                                                                         |
| Cache Statistics        | Has **Caches** ability, has **Metrics** ability, at least one of the following metrics exist: `cache.gets`,`cache.puts`,`cache.evictions`,`cache.hits`,`cache.misses`,`cache.removals`,`cache.size` |
| Threaddump              | Endpoint `/threaddump` exists and is accessible                                                                                                                                                     |
| Heapdump                | Endpoint `/heapdump` exists and is accessible                                                                                                                                                       |
| Shutdown                | Endpoint `/shutdown` exists and is accessible                                                                                                                                                       |
| Refresh                 | Endpoint `/refresh` exists and is accessible                                                                                                                                                        |
| Http Request Statistics | Has **Metrics** ability, the following metric exists: `http.server.requests`                                                                                                                        |
| Integration Graph       | Endpoint `/integrationgraph` exists and is accessible                                                                                                                                               |
| Properties              | Endpoint `/configprops` exists and is accessible                                                                                                                                                    |
| Mappings                | Endpoint `/mappings` exists and is accessible                                                                                                                                                       |
| Scheduled Tasks         | Endpoint `/scheduledtasks` exists and is accessible                                                                                                                                                 |
| Health                  | Endpoint `/health` exists and is accessible                                                                                                                                                         |
| Info                    | Endpoint `/info` exists and is accessible                                                                                                                                                           |
| System Properties       | Has **Env** ability, property source `systemProperties` exists                                                                                                                                      |
| System Environment      | Has **Env** ability, property source `systemEnvironment` exists                                                                                                                                     |
| Togglz                  | Endpoint `/togglz` exists and is accessible                                                                                                                                                         |
