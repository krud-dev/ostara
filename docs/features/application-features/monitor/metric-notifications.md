# Metric Notifications

## Overview

In the Metric Notifications screen you can set rules regarding metrics in your Application, for which to receive notifications. Ostara periodically updates the Metrics from Actuator, and applies the rules defined. In the event a rule evaluation (by any instance) is TRUE a notification  will be triggered.

Note: Notifications will re-trigger after 60 seconds of continuous FALSE evaluation of the rule.

## Usage

You can define custom metric notification rules and/or use predefined rules.

### Predefined Rules

Add predefined rules by clicking on the button. Ostara will automatically detect what metrics are available and add the corresponding rules. It is recommended to update trigger values to better suit your applications behavior.

<figure><img src="../../../.gitbook/assets/2023-06-09 17.47.34.gif" alt=""><figcaption></figcaption></figure>

### Custom Rules

You can define custom rules by clicking on the "Add rule" button. Then define the metric you want monitored and the trigger value. Ostara supports 2 types of rules:

#### Simple rule

A simple rule monitors a single metric and will be triggered when the metric crosses the trigger value.

#### Relative rule

A relative rule is one that tracks the relative value between 2 metrics. It will be triggered when the relative value crosses the trigger value.&#x20;

For example - A relative rule for free disk space on your instance.

The first metric will be `disk.free` and the relative value will be `disk.total` now we can define that if this value is lower than 0.2 (%20) we want to receive a notification.

<figure><img src="../../../.gitbook/assets/2023-06-09 17.50.06.gif" alt=""><figcaption></figcaption></figure>

#### Operations

Ostara supports 3 operations to compare against the trigger value.

1. Lower than '<' - will trigger if the metric value (or relation) is lower than the trigger value.
2. Greater than '>' - will trigger if the metric value (or relation) is greater than the trigger value.&#x20;
3. Between - will trigger if the metric value (or relation) is between the set trigger values.
