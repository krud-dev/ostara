package dev.ostara.springclient.util

import java.net.InetAddress

internal fun InetAddress.resolveHostname(): String {
  val canonicalHostname = canonicalHostName
  if (!canonicalHostname.isNullOrBlank()) {
    return canonicalHostname
  }
  val hostName = hostName
  if (!hostName.isNullOrBlank()) {
    return hostName
  }
  return hostAddress
}
