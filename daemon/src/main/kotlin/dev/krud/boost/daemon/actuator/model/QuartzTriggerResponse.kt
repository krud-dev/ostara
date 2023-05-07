package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.jackson.ParsedDate
import dev.krud.boost.daemon.utils.TypeDefaults

data class QuartzTriggerResponse(
    val group: String = TypeDefaults.STRING,
    val name: String = TypeDefaults.STRING,
    val description: String = TypeDefaults.STRING,
    val state: String = TypeDefaults.STRING,
    val type: String = TypeDefaults.STRING,
    val calendarName: String? = null,
    val startTime: ParsedDate? = null,
    val endTime: ParsedDate? = null,
    val previousFireTime: ParsedDate? = null,
    val nextFireTime: ParsedDate? = null,
    val priority: Int = TypeDefaults.INT,
    val finalFireTime: ParsedDate? = null,
    val data: Map<String, Any>? = null,
    val calendarInterval: CalendarInterval? = null,
    val custom: Custom? = null,
    val cron: Cron? = null,
    val dailyTimeInterval: DailyTimeInterval? = null,
    val simple: Simple? = null

) {

    data class CalendarInterval(
        val interval: Long = TypeDefaults.LONG,
        val timeZone: String = TypeDefaults.STRING,
        val timesTriggered: Int = TypeDefaults.INT,
        val preserveHourOfDayAcrossDaylightSavings: Boolean = TypeDefaults.BOOLEAN,
        val skipDayIfHourDoesNotExist: Boolean = TypeDefaults.BOOLEAN
    )

    data class Custom(
        val trigger: String = TypeDefaults.STRING
    )

    data class Cron(
        val expression: String = TypeDefaults.STRING,
        val timeZone: String = TypeDefaults.STRING
    )

    data class DailyTimeInterval(
        val interval: Long = TypeDefaults.LONG,
        val daysOfWeek: List<Int> = emptyList(),
        val startTimeOfDay: String = TypeDefaults.STRING,
        val endTimeOfDay: String = TypeDefaults.STRING,
        val repeatCount: Int = TypeDefaults.INT,
        val timesTriggered: Int = TypeDefaults.INT
    )

    data class Simple(
        val interval: Long = TypeDefaults.LONG,
        val repeatCount: Int = TypeDefaults.INT,
        val timesTriggered: Int = TypeDefaults.INT
    )
}