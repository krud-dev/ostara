package dev.krud.boost.daemon.actuator.model

import org.springframework.boot.logging.LogLevel

data class LoggerUpdateRequest(val configuredLevel: LogLevel?)