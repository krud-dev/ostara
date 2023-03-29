package dev.krud.boost.daemon.configuration.instance.hostname.model

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.entity.AbstractEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table

@Entity
@Table(name = "instance_hostname")
class InstanceHostname(
    @OneToOne
    @JoinColumn(name = "instance_id")
    var instance: Instance,
    @Column(nullable = true)
    var hostname: String?
) : AbstractEntity()