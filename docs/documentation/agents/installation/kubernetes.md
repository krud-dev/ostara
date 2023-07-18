# Kubernetes

### Installation Using Helm

To install the agent using Helm, first add the Ostara Helm repository

```bash
helm repo add ostara https://krud-dev.github.io/ostara-helm
```

Once added, you may install the chart using

```bash
helm install agent ostara/agent
```

For all available configurations, refer to the chart [README](https://github.com/krud-dev/ostara-helm/tree/main/charts/agent).
