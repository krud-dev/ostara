package dev.krud.boost.daemon.utils

import java.util.concurrent.CopyOnWriteArrayList

private val lock = Any()

fun <T : Any> CopyOnWriteArrayList<T>.addOrReplaceIf(replacementSupplier: () -> T, predicate: (T) -> Boolean) {
    removeIf(predicate)
    add(replacementSupplier())
}