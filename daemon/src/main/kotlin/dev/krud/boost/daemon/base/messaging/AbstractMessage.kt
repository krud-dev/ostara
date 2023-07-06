package dev.krud.boost.daemon.base.messaging

import org.springframework.messaging.Message
import org.springframework.messaging.MessageHeaders

abstract class AbstractMessage<T : Any>(private val payload: T, private val headers: MessageHeaders = MessageHeaders(mutableMapOf())) :
    Message<T> {

    constructor(payload: T, vararg headers: Pair<String, Any>) : this(payload, MessageHeaders(headers.toMap()))

    override fun getPayload(): T {
        return payload
    }

    override fun getHeaders(): MessageHeaders {
        return headers
    }
}