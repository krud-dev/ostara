package dev.krud.boost.daemon.configuration.instance.heapdump.store

import java.io.InputStream
import java.util.*

interface InstanceHeapdumpStore {
    val type: String
    fun storeHeapdump(referenceId: UUID, heapdump: InputStream): Result<String>
    fun getHeapdump(referenceId: UUID): Result<InputStream>
    fun deleteHeapdump(referenceId: UUID): Result<Unit>
}