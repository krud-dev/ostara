package dev.ostara.springclient.util

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.kotlin.whenever
import strikt.api.expect
import strikt.assertions.isEqualTo
import java.net.InetAddress

class AddressUtilsKtTest {

  @Test
  fun `resolveHostname should return canonicalHostName if not null or blank`() {
    val address: InetAddress = mock()
    whenever(address.canonicalHostName).thenReturn("canonicalHostName")
    expect {
      that(address.resolveHostname())
        .isEqualTo("canonicalHostName")
    }
  }

  @Test
  fun `resolveHostname should return hostName if not null or blank`() {
    val address: InetAddress = mock()
    whenever(address.hostName).thenReturn("hostName")
    expect {
      that(address.resolveHostname())
        .isEqualTo("hostName")
    }
  }
}
