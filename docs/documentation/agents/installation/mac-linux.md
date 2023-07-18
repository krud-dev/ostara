# Mac/Linux

### Installation Using Brew

The agent is published on Brew and is available for installation on both Mac and Linux.

To install the agent using brew, run the following command and follow the instructions that appear on the screen

```
brew install krud-dev/tap/ostara-agent
```

Once the agent is properly configured, you can start it by running `brew services start ostara-agent`

The logs for the agent will be available at `<HOMEBREW_HOME>/var/log/ostara-agent.log`

### Standalone Installation

For a more hands-off installation, you may [download](https://search.maven.org/artifact/dev.ostara/ostara-agent) the JAR directly from Maven Central.

To set up and run the agent, run the following:

```bash
java -jar ostara-agent-VERSION.jar setup
java -jar ostara-agent-VERSION.jar start
```

{% hint style="warning" %}
When running the jar directly, ensure your installed Java is 17 or above&#x20;
{% endhint %}
