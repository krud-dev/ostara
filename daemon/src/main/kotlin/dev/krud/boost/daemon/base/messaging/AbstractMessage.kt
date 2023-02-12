package dev.krud.boost.daemon.base.messaging

import org.springframework.messaging.Message
import org.springframework.messaging.MessageHeaders

abstract class AbstractMessage<T>(private val payload: T, private val headers: MessageHeaders = MessageHeaders(emptyMap())) :
    Message<T> {
    override fun getPayload(): T {
        return payload
    }

    override fun getHeaders(): MessageHeaders {
        return headers
    }
}