package dev.krud.boost.daemon.actuator.model

import com.google.gson.annotations.SerializedName
import java.util.*

data class QuartzTriggerResponse(
    val group: String,
    val name: String,
    val description: String,
    val state: State,
    val type: Type,
    val calendarName: String?,
    val startTime: Date?,
    val endTime: Date?,
    val previousFireTime: Date?,
    val nextFireTime: Date?,
    val priority: Int,
    val finalFireTime: Date?,
    val data: Map<String, String>?,
    val calendarInterval: CalendarInterval?,
    val custom: Custom?,
    val cron: Cron?,
    val dailyTimeInterval: DailyTimeInterval?,
    val simple: Simple?

) {
    enum class State {
        NONE,
        NORMAL,
        PAUSED,
        COMPLETE,
        ERROR,
        BLOCKED
    }

    enum class Type {
        @SerializedName("calendarInterval")
        CALENDAR_INTERVAL,

        @SerializedName("cron")
        CRON,

        @SerializedName("custom")
        CUSTOM,

        @SerializedName("dailyTimeInterval")
        DAILY_TIME_INTERVAL,

        @SerializedName("simple")
        SIMPLE
    }

    data class CalendarInterval(
        val interval: Long,
        val timeZone: String,
        val timesTriggered: Int,
        val preserveHourOfDayAcrossDaylightSavings: Boolean,
        val skipDayIfHourDoesNotExist: Boolean
    )

    data class Custom(
        val trigger: String
    )

    data class Cron(
        val expression: String,
        val timeZone: String
    )

    data class DailyTimeInterval(
        val interval: Long,
        val daysOfWeek: List<Int>,
        val startTimeOfDay: String,
        val endTimeOfDay: String,
        val repeatCount: Int,
        val timesTriggered: Int
    )

    data class Simple(
        val interval: Long,
        val repeatCount: Int,
        val timesTriggered: Int
    )
}