package dev.krud.boost.daemon.demo

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.stubApplication
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.test.TestKrud
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.contains
import strikt.assertions.isEmpty
import strikt.assertions.isEqualTo
import strikt.assertions.isTrue
import java.util.UUID

class DemoServiceTest {
    private val applicationKrud = TestKrud(Application::class.java) { UUID.randomUUID() }
    private val instanceKrud = TestKrud(Instance::class.java) { UUID.randomUUID() }
    private val demoService = DemoService(applicationKrud, instanceKrud)

    @Test
    fun `createDemoApplication should create a demo instance and application`() {
        val url = "http://localhost:13333"
        demoService.createDemoApplication(url)
        val application = applicationKrud.entities.first()
        val instance = instanceKrud.entities.first()
        expectThat(application.demo)
            .isTrue()
        expectThat(instance.demo)
            .isTrue()
        expectThat(instance.actuatorUrl)
            .isEqualTo(url)
    }

    @Test
    fun `deleteDemoApplications should delete all applications where demo=true`() {
        applicationKrud.create(
            stubApplication(demo = true)
        )
        applicationKrud.create(
            stubApplication()
        )
        demoService.deleteDemoApplications()
        expectThat(applicationKrud.entities.size)
            .isEqualTo(1)
    }
}