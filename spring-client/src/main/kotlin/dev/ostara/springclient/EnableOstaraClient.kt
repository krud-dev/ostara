package dev.ostara.springclient

import dev.ostara.springclient.config.OstaraClientConfiguration
import org.springframework.context.annotation.Import

@Import(OstaraClientConfiguration::class)
annotation class EnableOstaraClient
