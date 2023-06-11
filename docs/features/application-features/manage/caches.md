# Caches

### Overview

Caches at the application level is exactly the same as the instance level [caches.md](../../instance-features/manage/caches.md "mention"), but apply their changes to every active instance within the application.&#x20;

Evicting a cache will attempt to evict it for all active instances, and cache statistics when present represent an aggregation of all instances where such statistics were found.

### Usage

There are 3 ways to evict caches.

1. Click on the broom icon next to an individual cache
2. Check several caches, and click on the broom icon in the green bar that appears
3. Click the broom icon at the top right, to evict all caches

<figure><img src="../../../.gitbook/assets/2023-04-02 15.29.18.gif" alt=""><figcaption></figcaption></figure>

When the **Cache Statistics** ability is present, the cache rows become expandable, and upon expansions display the cache statistics.

<figure><img src="../../../.gitbook/assets/2023-04-02 15.31.10 (1).gif" alt=""><figcaption></figcaption></figure>



### Required Abilities

* [Caches](../../abilities.md)
* [Cache Statistics ](../../abilities.md#abilities)(For statistics only)

