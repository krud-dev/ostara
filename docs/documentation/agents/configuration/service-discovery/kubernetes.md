# Kubernetes

Kubernetes service discovery can be used to discover instances using Kuberentes' API.

Agents that run this type of service discovery can operate both outside and within a cluster.

If operating outside of a cluster, `ostara.agent.service-discovery.kubernetes.kube-config-path` or `ostara.agent.service-discovery.kubernetes.kube-config-yaml` may be set. If neither are set, it will attempt to find the kube configuration on its own. Additionally, the `ostara.agent.service-discovery.namespace` must be set.

When operating within a cluster, the agent will use the pod's service account in order to gain access to the cluster, so neither should be set. While a namespace may be set in this approach, if it is not set; the agent will attempt to resolve its own namespace as a last resort. Finally, this type of service discovery becomes active by default when the agent detects it is inside a cluster.

### Enabling Discovery

You can enable Kubernetes service discovery in the configuration file by setting `ostara.agent.main.kubernetes.enabled` to `true`

{% hint style="info" %}
When operating inside of Kubernetes, the agent will enable this type of service discovery by default
{% endhint %}

* Namespace: The namespace will be taken from the underlaying kub it is running on, if you are running the Agent outside of kub, you must configure the namespace.
* Actuator path: by default `/actuator` will be used, if you have set a custom path, configure it here
* Kub config: The Agent uses the default config if not set, if set `kubeConfigYaml` takes precedence over `kubeConfigPath`
* Port: By default if only 1 port is found it will be used, if multiple ports are found we will seek out the port named in the config.
* Pod Labels: Here you can set the K/V for the labels on the Pods you want the Agent return from service discovery.

### &#x20;Configuration Table

| Name                                                             | Default Value |                                                                                                        Description                                                                                                       |
| ---------------------------------------------------------------- | ------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `ostara.agent.service-discovery.kubernetes.enabled`              | `false`       |                                                                                  Whether Kubernetes service discovery is enabled or not                                                                                  |
| `ostara.agent.service-discovery.kubernetes.kube-config-path`     | `null`        |                                                                                              The path to the kubeconfig file                                                                                             |
| `ostara.agent.service-discovery.kubernetes.kube-config-yaml`     | `null`        |                                                                           The kubeconfig yaml as a string, supersedes `kube-config-path` if set                                                                          |
| `ostara.agent.service-discovery.kubernetes.namespace`            | `null`        |                                                           The namespace to search for pods in. Does not need to be set if running in a pod, otherwise mandatory                                                          |
| `ostara.agent.service-discovery.kubernetes.actuator-path`        | `/actuator`   |                                                                                               The context path of actuator                                                                                               |
| `ostara.agent.service-discovery.kubernetes.management-port-name` | `management`  | In case actuator running on a different port, the name of the port to seek. If the pod in question only has one port, this field is ignored. If it has more than one but none match this field, the first one is chosen. |
| `ostara.agent.service-discovery.kubernetes.scheme`               | `http`        |                                                                                  The scheme to use when communicating with the instances                                                                                 |
| `ostara.agent.service-discovery.kubernetes.pod-labels`           | `{}`          |                                                                                   The pod label selector to filter prospective pods by                                                                                   |



