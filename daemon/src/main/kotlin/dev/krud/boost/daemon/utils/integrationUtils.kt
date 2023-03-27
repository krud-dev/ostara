package dev.krud.boost.daemon.utils

import org.springframework.messaging.MessageChannel
import org.springframework.messaging.MessageHeaders
import org.springframework.messaging.support.GenericMessage

fun <T : Any> MessageChannel.sendGeneric(payload: T, headers: MessageHeaders = MessageHeaders(null), timeout: Long = MessageChannel.INDEFINITE_TIMEOUT): Boolean {
    return send(GenericMessage(payload, headers), timeout)
}