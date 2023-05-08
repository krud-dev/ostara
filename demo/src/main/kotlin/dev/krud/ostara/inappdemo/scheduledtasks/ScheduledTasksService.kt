package dev.krud.ostara.inappdemo.scheduledtasks

import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service

@Service
class ScheduledTasksService {
  @Scheduled(cron = "0 0 * * * *")
  fun updateProductPricing() {
    // code to update product pricing from vendor
  }

  @Scheduled(fixedDelay = 24 * 60 * 60 * 1000)
  fun deleteOldLogFiles() {
    // code to delete old log files
  }

  @Scheduled(fixedRate = 5 * 60 * 1000)
  fun updateInventory() {
    // code to update inventory levels in the database
  }
}
