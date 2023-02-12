package dev.krud.boost.daemon.configuration.instance.enums

enum class InstanceHealthStatus(
    /**
     * Whether the instance is up, running and accessible, even if it's in a downed state
     */
    val running: Boolean
) {
    UP(true),
    DOWN(true),
    UNKNOWN(false),
    OUT_OF_SERVICE(true),
    UNREACHABLE(false),
    PENDING(false),
    INVALID(false)
}