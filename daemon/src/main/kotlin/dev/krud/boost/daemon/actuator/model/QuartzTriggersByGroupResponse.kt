package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.jackson.ParsedDate
import dev.krud.boost.daemon.utils.TypeDefaults

data class QuartzTriggersByGroupResponse(
    val group: String = TypeDefaults.STRING,
    val paused: Boolean = TypeDefaults.BOOLEAN,
    val triggers: Triggers = Triggers()
) {
    data class Triggers(
        val cron: Map<String, Cron> = emptyMap(),
        val simple: Map<String, Simple> = emptyMap(),
        val dailyTimeInterval: Map<String, DailyTimeInterval> = emptyMap(),
        val calendarInterval: Map<String, CalendarInterval> = emptyMap(),
        val custom: Map<String, Custom> = emptyMap()
    )

    data class Cron(
        val previousFireTime: ParsedDate? = null,
        val nextFireTime: ParsedDate? = null,
        val priority: Int = TypeDefaults.INT,
        val expression: String = TypeDefaults.STRING,
        val timeZone: String = TypeDefaults.STRING
    )

    data class Simple(
        val previousFireTime: ParsedDate? = null,
        val nextFireTime: ParsedDate? = null,
        val priority: Int = TypeDefaults.INT,
        val interval: Long = TypeDefaults.LONG
    )

    data class DailyTimeInterval(
        val previousFireTime: ParsedDate? = null,
        val nextFireTime: ParsedDate? = null,
        val priority: Int = TypeDefaults.INT,
        val interval: Long = TypeDefaults.LONG,
        val daysOfWeek: List<String>,
        val startTimeOfDay: String = TypeDefaults.STRING,
        val endTimeOfDay: String = TypeDefaults.STRING
    )

    data class CalendarInterval(
        val previousFireTime: ParsedDate? = null,
        val nextFireTime: ParsedDate? = null,
        val priority: Int = TypeDefaults.INT,
        val interval: Long = TypeDefaults.LONG,
        val timeZone: String = TypeDefaults.STRING
    )

    data class Custom(
        val previousFireTime: ParsedDate? = null,
        val nextFireTime: ParsedDate? = null,
        val priority: Int = TypeDefaults.INT,
        val trigger: String = TypeDefaults.STRING
    )
}