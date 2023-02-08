package dev.krud.boost.daemon.entity

import dev.krud.crudframework.jpa.annotation.JpaCrudEntity
import dev.krud.crudframework.model.BaseCrudEntity
import jakarta.persistence.*
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.LocalDateTime
import java.util.*

@MappedSuperclass
@JpaCrudEntity
abstract class AbstractEntity : BaseCrudEntity<UUID>() {
  @Id
  @GeneratedValue
  @Column(nullable = false, updatable = false)
  override lateinit var id: UUID

  @Version
  @Column(nullable = false)
  var version: Long? = null

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  var creationTime: LocalDateTime = LocalDateTime.now()

  @UpdateTimestamp
  @Column(nullable = false)
  var lastUpdateTime: LocalDateTime = LocalDateTime.now()

  override fun exists(): Boolean = this::id.isInitialized

  override fun equals(other: Any?): Boolean {
    if (this === other) return true
    if (javaClass != other?.javaClass) return false

    other as AbstractEntity

    if (id != other.id) return false

    return true
  }

  override fun hashCode(): Int {
    return id?.hashCode() ?: 0
  }
}
