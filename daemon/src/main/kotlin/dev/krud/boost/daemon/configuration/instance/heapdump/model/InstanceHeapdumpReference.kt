package dev.krud.boost.daemon.configuration.instance.heapdump.model

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.heapdump.ro.InstanceHeapdumpReferenceRO
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.crudframework.crud.annotation.Deleteable
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.Lob
import jakarta.persistence.ManyToOne
import jakarta.persistence.Temporal
import jakarta.persistence.TemporalType
import java.util.Date
import java.util.UUID

@Entity
@DefaultMappingTarget(InstanceHeapdumpReferenceRO::class)
@MappedField(mapFrom = "id")
@Deleteable(false)
class InstanceHeapdumpReference(
    @Column(name = "instance_id", nullable = false)
    @MappedField
    var instanceId: UUID
) : AbstractEntity() {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instance_id", insertable = false, updatable = false)
    lateinit var instance: Instance

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(30) default 'PENDING_DOWNLOAD'")
    @MappedField
    var status: Status = Status.PENDING_DOWNLOAD

    @Column(nullable = true)
    @MappedField
    var path: String? = null

    @Column(nullable = true)
    @MappedField
    var size: Long? = null

    @Column(nullable = true)
    @Temporal(TemporalType.TIMESTAMP)
    @MappedField
    var downloadTime: Date? = null

    @Column(nullable = true)
    @Lob
    var error: String? = null

    enum class Status {
        PENDING_DOWNLOAD,
        DOWNLOADING,
        READY,
        FAILED
    }

    companion object {
        fun InstanceHeapdumpReference.ready(path: String, size: Long) {
            this.status = Status.READY
            this.path = path
            this.size = size
            this.downloadTime = Date()
        }
        fun InstanceHeapdumpReference.failed(error: String) {
            this.status = Status.FAILED
            this.error = error
        }

        fun InstanceHeapdumpReference.failed(throwable: Throwable) = failed(throwable.message ?: "Unknown error: ${throwable.javaClass.name}")
    }
}