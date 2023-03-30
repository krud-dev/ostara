package dev.krud.boost.daemon.configuration.instance.hostname.resolver

import dev.krud.boost.daemon.configuration.instance.entity.Instance

interface InstanceHostnameResolver {
    fun resolveHostname(instance: Instance): String?
}