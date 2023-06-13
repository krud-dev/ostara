package dev.krud.boost.daemon.demo

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.crudframework.crud.handler.krud.Krud
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.beans.factory.InitializingBean
import org.springframework.stereotype.Service
import java.util.*

@Service
class DemoService(
    private val applicationKrud: Krud<Application, UUID>,
    private val instanceKrud: Krud<Instance, UUID>
) : InitializingBean {

    override fun afterPropertiesSet() {
        deleteDemoApplications()
    }

    fun createDemoApplication(actuatorUrl: String) {
        log.debug { "Creating demo application for URL $actuatorUrl" }
        val application = applicationKrud.create(
            Application(
                "Demo Application",
                null,
                ApplicationType.SPRING_BOOT
            ).apply {
                demo = true
            }
        )
        instanceKrud.create(
            Instance(
                "Demo Instance",
                actuatorUrl,
                application.id
            ).apply {
                demo = true
            }
        )
    }

    fun deleteDemoApplications() {
        applicationKrud.deleteByFilter {
            where {
                Application::demo Equal true
            }
        }
    }

    private val log = KotlinLogging.logger { }
}