package dev.krud.boost.daemon.controller

import io.swagger.v3.oas.annotations.Hidden
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@Hidden
class RootController {
    @GetMapping("/")
    fun root(): String {
        return "OK"
    }
}