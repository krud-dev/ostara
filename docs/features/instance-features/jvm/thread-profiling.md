# Thread Profiling

### Overview

Thread Profiling allows you to to profile the threads within your application for a set amount of time, after which you will be able to explore the results of the profiling.

### Usage

To initiate a new profiling, click the **Request Thread Profiling** at the top right

<figure><img src="../../../.gitbook/assets/2023-04-03 13.16.35.gif" alt=""><figcaption></figcaption></figure>

Upon completion, click the **View Details** action to reveal the profiling window

The profiler runs for 60 seconds and gathers all thread dumps form this time, grouping the data by thread and thread state over time.&#x20;

&#x20;     \- Represents threads in a `RUNNING` state

&#x20;     \- Represents threads in a `WAITING` state

&#x20;     \- Represents threads in a `TIMED_WAITING` state

<figure><img src="../../../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>

Each grouped block is expandable and will show the thread's details, as well as the stack trace. Multiple blocks can be expanded at a time.

<figure><img src="../../../.gitbook/assets/2023-04-03 13.27.29.gif" alt=""><figcaption></figcaption></figure>

### Required Abilities

* [Thread Dump](../../abilities.md)

