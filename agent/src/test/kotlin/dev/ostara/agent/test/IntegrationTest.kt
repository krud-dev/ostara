package dev.ostara.agent.test

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
@AutoConfigureMockMvc
@Target(AnnotationTarget.CLASS)
annotation class IntegrationTest
