# ZooKeeper

ZooKeeper Service Discovery can be used to discover instances on ZooKeeper that were published by Spring Cloud ZooKeeper.

### Enabling Discovery

You can enable ZooKeeper discovery in the configuration file by setting `ostara.agent.main.zookeeper.enabled` to `true`

### &#x20;Configuration Table

<table><thead><tr><th>Name</th><th width="220">Default Value</th><th align="center">Description</th></tr></thead><tbody><tr><td><code>ostara.agent.main.zookeeper.enabled</code></td><td><code>false</code></td><td align="center">Whether ZooKeeper service discovery is enabled or not</td></tr><tr><td><code>ostara.agent.main.zookeeper.connection-string</code></td><td></td><td align="center">The Connection String that is needed to connect to Apache ZooKeeper. This is a comma-separated list of hostname:port pairs. For example, <code>localhost:2181,localhost:2182,localhost:2183.</code> This should contain a list of all ZooKeeper instances in the ZooKeeper quorum</td></tr><tr><td><code>ostara.agent.main.zookeeeper.rootNode</code></td><td><code>/services</code></td><td align="center">The node where services and service instances are kept. This defaults to the Curator recipe default of <code>/services</code>, and should not be changed under normal conditions</td></tr><tr><td><code>ostara.agent.main.zookeeper.actuator-path</code></td><td><code>/actuator</code></td><td align="center">The context path of actuator </td></tr><tr><td><code>ostara.agent.main.zookeeper.metadata</code></td><td><code>{}</code></td><td align="center">The metadata that the agent should filter by when seeking agents. If the map is empty, the filter will not be applied</td></tr></tbody></table>

