package dev.krud.ostara.inappdemo.properties

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.NestedConfigurationProperty
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "app")
class AppProperties {
  @NestedConfigurationProperty
  var db: DbProperties = DbProperties()
  @NestedConfigurationProperty
  var server: ServerProperties = ServerProperties()
  @NestedConfigurationProperty
  var logging: LoggingProperties = LoggingProperties()
  @NestedConfigurationProperty
  var email: EmailProperties = EmailProperties()
  @NestedConfigurationProperty
  var payment: PaymentProperties = PaymentProperties()
  @NestedConfigurationProperty
  var notification: NotificationProperties = NotificationProperties()

  class DbProperties {
    lateinit var url: String
    lateinit var username: String
    lateinit var password: String
  }

  class ServerProperties {
    lateinit var host: String
    var port: Int = 8080
  }

  class LoggingProperties {
    lateinit var level: String
    lateinit var filepath: String
  }

  class EmailProperties {
    lateinit var host: String
    var port: Int = 587
    lateinit var username: String
    lateinit var password: String
  }

  class PaymentProperties {
    lateinit var provider: String
    var payfast: PayfastProperties = PayfastProperties()

    class PayfastProperties {
      var merchantId: String = ""
      var merchantKey: String = ""
    }
  }

  class NotificationProperties {
    lateinit var provider: String
    var notifyme: NotifymeProperties = NotifymeProperties()

    class NotifymeProperties {
      var apiKey: String = ""
      var fromNumber: String = ""
    }
  }
}
