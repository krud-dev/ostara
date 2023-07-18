# Service Discovery

#### Kubernetes

* Check that you are running within the cluster, or that the server you are running can access the cluster
* Ensure your configuration is correct, including any filters for services to be discovered

#### ZooKeeper

* Check the Agent can connect to ZooKeeper URLs and ports.

#### Internal

* Make sure that the services have the `Client` dependencies
* Make sure you are using the correct API key from the Agent
* Run `curl` to Agent port from service device
