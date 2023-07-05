package dev.krud.boost.daemon.utils

import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.model.BaseCrudEntity
import dev.krud.crudframework.modelfilter.dsl.FilterFieldsBuilder
import java.io.Serializable

fun <Entity : BaseCrudEntity<ID>, ID : Serializable> Krud<Entity, ID>.searchSequence(chunkSize: Long = 100L, block: FilterFieldsBuilder<Entity>.() -> Unit = {}) = sequence {
    var hasMore: Boolean
    var offset = 0L
    do {
        val result = this@searchSequence.searchByFilter {
            where(block)
            limit = chunkSize
            start = offset
        }
        yieldAll(result.results)
        hasMore = result.hasMore
        offset += chunkSize
    } while (hasMore)
}