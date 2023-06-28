import io.ktor.plugin.features.*

val ktor_version: String by project
val koin_version: String by project
val koin_ktor_version: String by project
val kotlin_version: String by project
val logback_version: String by project

plugins {
  kotlin("jvm") version "1.8.22"
  id("io.ktor.plugin") version "2.3.1"
  id("org.sonarqube") version "4.2.1.3168"
  jacoco
}

group = "dev.ostara"
version = "0.11.0-SNAPSHOT"
application {
  mainClass.set("dev.ostara.agent.ApplicationKt")

  val isDevelopment: Boolean = project.ext.has("development")
  applicationDefaultJvmArgs = listOf("-Dio.ktor.development=$isDevelopment")
}

repositories {
  mavenCentral()
}

ktor {
  docker {
    localImageName.set("idane/ostara-agent")
    imageTag.set(version.toString())
    jreVersion.set(io.ktor.plugin.features.JreVersion.JRE_17)
    portMappings.set(
      listOf(
        DockerPortMapping(14444, 14444)
      )
    )
    externalRegistry.set(
      DockerImageRegistry.dockerHub(
        appName = provider { "ostara-agent" },
        username = providers.environmentVariable("DOCKER_HUB_USERNAME"),
        password = providers.environmentVariable("DOCKER_HUB_PASSWORD")
      )
    )
  }
}

dependencies {
  implementation("io.ktor:ktor-server-core-jvm:$ktor_version")
  implementation("io.ktor:ktor-server-host-common-jvm:$ktor_version")
  implementation("io.ktor:ktor-server-content-negotiation-jvm:$ktor_version")
  implementation("io.ktor:ktor-server-forwarded-header-jvm:$ktor_version")
  implementation("io.ktor:ktor-server-call-logging:$ktor_version")
  implementation("io.ktor:ktor-server-auth-jvm:$ktor_version")
  implementation("io.ktor:ktor-serialization-jackson-jvm:$ktor_version")
  implementation("io.ktor:ktor-server-netty-jvm:$ktor_version")
  implementation("io.ktor:ktor-client-core:$ktor_version")
  implementation("io.ktor:ktor-client-okhttp:$ktor_version")
  implementation("io.ktor:ktor-server-request-validation:$ktor_version")
  implementation("io.ktor:ktor-server-status-pages:$ktor_version")
  implementation("com.github.mrmike:ok2curl:0.8.0")

  implementation("io.insert-koin:koin-core:$koin_version")
  implementation("io.insert-koin:koin-ktor:$koin_ktor_version")

  implementation("ch.qos.logback:logback-classic:$logback_version")
  implementation("io.kubernetes:client-java:18.0.0") {
    exclude(group = "org.slf4j", module = "slf4j-api")
  }
  implementation("io.ktor:ktor-server-call-logging-jvm:2.3.1")
  testImplementation("io.ktor:ktor-server-tests-jvm:$ktor_version")
  testImplementation("org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version")
  testImplementation("io.strikt:strikt-core:0.34.0")
  testImplementation("org.mockito.kotlin:mockito-kotlin:5.0.0")
}

sonar {
  properties {
    property("sonar.projectKey", "ostara-agent")
    property("sonar.organization", "krud-dev")
    property("sonar.host.url", "https://sonarcloud.io")
  }
}

tasks.test {
  finalizedBy(tasks.jacocoTestReport)
  maxParallelForks = Runtime.getRuntime().availableProcessors()
}

tasks.jacocoTestReport {
  dependsOn(tasks.test)
  reports {
    xml.required.set(true)
    html.required.set(false)
  }
}
