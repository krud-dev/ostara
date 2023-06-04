package dev.krud.boost.daemon.util

object FileUtils {
    fun loadJson(path: String): String? {
        return javaClass
            .classLoader
            .getResourceAsStream(path)
            ?.readAllBytes()
            ?.toString(Charsets.UTF_8)
    }
}
