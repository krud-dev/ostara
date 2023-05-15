package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.demo.DemoService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("$API_PREFIX/demo")
class DemoController(
    private val demoService: DemoService
) {
    @PostMapping
    fun createDemoApplication(@RequestParam actuatorUrl: String) {
        return demoService.createDemoApplication(actuatorUrl)
    }

    @DeleteMapping
    fun deleteDemoApplications() {
        return demoService.deleteDemoApplications()
    }
}