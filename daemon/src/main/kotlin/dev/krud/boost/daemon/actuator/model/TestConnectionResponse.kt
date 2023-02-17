package dev.krud.boost.daemon.actuator.model

data class TestConnectionResponse(
    val statusCode: Int,
    val statusText: String?,
    val validActuator: Boolean,
    val success: Boolean
)