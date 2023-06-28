package dev.krud.boost.daemon.agent.model

import dev.krud.boost.daemon.agent.ro.AgentRO
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.crudframework.crud.annotation.Deleteable
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.*
import java.util.*

@Entity
@DefaultMappingTarget(AgentRO::class)
@MappedField(mapFrom = "id")
@Deleteable(softDelete = false)
class Agent(
    @MappedField
    @Column(nullable = false)
    var name: String,

    @MappedField
    @Column(nullable = false)
    var url: String,

    @MappedField
    @Column(nullable = true)
    var apiKey: String? = null
) : AbstractEntity() {

    companion object {
        const val NAME = "agent"
    }
}