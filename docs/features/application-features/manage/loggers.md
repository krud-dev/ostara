# Loggers

### Overview

Loggers at the application level is exactly the same as the instance level [loggers.md](../../instance-features/manage/loggers.md "mention"), but apply their changes to every active instance within the application.&#x20;

### Usage

To change the log level of a given logger, simply click on one of the log levels to the right. The change will affect any other loggers within the hierarchy of the logger which were not explicitly set on Ostara or in the app configuration. At any point, you may press the **Reset** button on the right of any Ostara configured logger and reset it to its original state.

Loggers which were not configured, but inherit configuration will appear faded, whereas explicitly configured loggers will appear solid.

<figure><img src="../../../.gitbook/assets/2023-04-02 16.42.10.gif" alt=""><figcaption></figcaption></figure>

You can also filter the list to show only explicitly configured loggers by clicking on **Configured** in the top right:

<figure><img src="../../../.gitbook/assets/2023-04-02 16.44.23 (1).gif" alt=""><figcaption></figcaption></figure>

Additionally, you can choose to only show loggers which represent classes by clicking on **Classes** in the top right

<figure><img src="../../../.gitbook/assets/2023-04-02 16.45.29.gif" alt=""><figcaption></figcaption></figure>

In addition to this, if multiple instances have conflicting log levels for certain loggers, they will be displayed like so:

<figure><img src="../../../.gitbook/assets/image (8).png" alt=""><figcaption></figcaption></figure>





### Required Abilities

* [Loggers](../../abilities.md)

