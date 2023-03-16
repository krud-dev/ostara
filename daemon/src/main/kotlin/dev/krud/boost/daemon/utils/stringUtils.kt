package dev.krud.boost.daemon.utils

fun String.stripHttpProtocolIfPresent(): String {
    return this.replaceFirst("^(https?://)".toRegex(), "")
}

fun String.stripEverythingAfterLastSlash(): String {
    return this.replaceFirst("/[^/]*$".toRegex(), "")
}