package dev.krud.ostara.inappdemo.quartz

import org.quartz.*
import org.quartz.SimpleScheduleBuilder.simpleSchedule
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.quartz.JobDetailFactoryBean

class TransactionalEmailJob : Job {
    override fun execute(context: JobExecutionContext?) {
        Thread.sleep(1000)
    }
}

@Configuration
class QuartzConfig {
    @Bean
    fun transactionalEmailJob(): JobDetailFactoryBean = createJob<TransactionalEmailJob>("This job sends transactional emails")

    @Bean
    fun simpleTrigger(job: JobDetail): Trigger? {
        return TriggerBuilder.newTrigger().forJob(job)
            .withIdentity("Quartz_SimpleTrigger")
            .withDescription("Simple Trigger every hour")
            .withSchedule(simpleSchedule().repeatForever().withIntervalInHours(1))
            .build()
    }

    @Bean
    fun cronTrigger(job: JobDetail): Trigger? {
        return TriggerBuilder.newTrigger().forJob(job)
            .withIdentity("Quartz_CronTrigger")
            .withDescription("Cron Trigger example every 5 seconds")
            .withSchedule(CronScheduleBuilder.cronSchedule("0/5 * * * * ?"))
            .build()
    }

    @Bean
    fun dailyTrigger(job: JobDetail): Trigger? {
        return TriggerBuilder.newTrigger().forJob(job)
            .withIdentity("Quartz_DailyTrigger")
            .withDescription("Daily Trigger every day at 12:00")
            .withSchedule(CronScheduleBuilder.dailyAtHourAndMinute(12, 0))
            .build()
    }

    @Bean
    fun calendarTrigger(job: JobDetail): Trigger? {
        val calendar = java.util.Calendar.getInstance()
        calendar.set(java.util.Calendar.HOUR_OF_DAY, 12)
        calendar.set(java.util.Calendar.MINUTE, 0)
        calendar.set(java.util.Calendar.SECOND, 0)
        calendar.set(java.util.Calendar.MILLISECOND, 0)
        return TriggerBuilder.newTrigger().forJob(job)
            .withIdentity("Quartz_CalendarTrigger")
            .withDescription("Calendar Trigger every day at 12:00")
            .startAt(calendar.time)
            .build()
    }

    private inline fun <reified JobType : Job> createJob(description: String, durability: Boolean = true): JobDetailFactoryBean {
        val jobDetailFactory = JobDetailFactoryBean()
        jobDetailFactory.setJobClass(JobType::class.java)
        jobDetailFactory.setDescription(description)
        jobDetailFactory.setDurability(durability)
        return jobDetailFactory
    }
}
