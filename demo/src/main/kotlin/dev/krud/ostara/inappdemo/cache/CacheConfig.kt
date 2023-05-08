package dev.krud.ostara.inappdemo.cache

import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class CacheConfig {
  @Bean
  fun cacheManager() = ConcurrentMapCacheManager(
    *CACHE_NAMES
  )

  companion object {
    val CACHE_NAMES = arrayOf(
      "invoices_cache",
      "users_last_login_cache",
      "users_data_cache",
      "payments_cache",
      "users_phone_cache",
      "transactions_schema_cache",
      "products_cache",
      "customers_cache",
      "customers_data_cache",
      "shipments_cache",
      "customers_sales_rep_cache",
      "products_description_cache"
    )
  }
}
