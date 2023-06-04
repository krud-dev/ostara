package dev.krud.boost.daemon.utils

import org.springframework.cache.Cache
import org.springframework.cache.CacheManager
import org.springframework.cache.get
import kotlin.reflect.KProperty

class CacheDelegator(private val cacheManager: CacheManager) {
    private lateinit var cache: Cache
    operator fun getValue(thisRef: Any?, property: KProperty<*>): Cache {
        if (!this::cache.isInitialized) {
            cache = cacheManager[property.name] ?: throw IllegalArgumentException("Cache ${property.name} not found")
        }
        return cache
    }
}

fun CacheManager.resolve() = CacheDelegator(this)

inline fun <reified T> Cache.getTyped(key: Any): T? = get(key, T::class.java)

inline fun <reified T> Cache.computeIfAbsent(key: Any, mappingFunction: (Any) -> T): T {
    val value = getTyped<T>(key)
    if (value != null) {
        return value
    }
    val newValue = mappingFunction(key)
    put(key, newValue)
    return newValue
}