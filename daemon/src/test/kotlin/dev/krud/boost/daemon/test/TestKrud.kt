package dev.krud.boost.daemon.test

import dev.krud.crudframework.crud.exception.CrudUpdateException
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.model.BaseCrudEntity
import dev.krud.crudframework.modelfilter.DynamicModelFilter
import dev.krud.crudframework.ro.PagedResult
import dev.krud.crudframework.util.filtersMatch
import java.io.Serializable

class TestKrud<Entity : BaseCrudEntity<ID>, ID : Serializable>(override val entityClazz: Class<Entity>) :
    Krud<Entity, ID> {
    val entities = mutableListOf<Entity>()
    override fun bulkCreate(entities: List<Entity>, applyPolicies: Boolean): List<Entity> {
        this.entities.addAll(entities)
        return entities
    }

    override fun create(entity: Entity, applyPolicies: Boolean): Entity {
        entities.add(entity)
        return entity
    }

    override fun deleteById(id: ID, applyPolicies: Boolean) {
        entities.removeIf { it.id == id }
    }

    override fun searchByFilter(filter: DynamicModelFilter, cached: Boolean, persistCopy: Boolean, applyPolicies: Boolean): PagedResult<Entity> {
        return PagedResult.of(
            entities.filter {
                filter.filtersMatch(it)
            }
        )
    }

    override fun searchByFilterCount(filter: DynamicModelFilter, applyPolicies: Boolean): Long {
        return entities.filter {
            filter.filtersMatch(it)
        }.size.toLong()
    }

    override fun showByFilter(filter: DynamicModelFilter, cached: Boolean, persistCopy: Boolean, applyPolicies: Boolean): Entity? {
        return entities.firstOrNull {
            filter.filtersMatch(it)
        }
    }

    override fun update(entity: Entity, applyPolicies: Boolean): Entity {
        val removed = entities.removeIf { it.id == entity.id }
        if (!removed) {
            throw CrudUpdateException("Entity not found")
        }
        entities.add(entity)
        return entity
    }

    override fun showById(id: ID, cached: Boolean, persistCopy: Boolean, applyPolicies: Boolean): Entity? {
        return entities.firstOrNull { it.id == id }
    }
}