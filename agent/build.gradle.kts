import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  id("org.springframework.boot") version "3.1.1"
  id("io.spring.dependency-management") version "1.1.0"
  kotlin("jvm") version "1.8.22"
  kotlin("plugin.spring") version "1.8.22"
  jacoco
  id("org.sonarqube") version "4.2.1.3168"
}

group = "dev.ostara"
version = "0.12.0-SNAPSHOT"

java {
  sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
  mavenCentral()
}

extra["springCloudVersion"] = "2022.0.3"

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.apache.curator:curator-framework:5.5.0")
  implementation("org.springframework.cloud:spring-cloud-starter-zookeeper-discovery")
  implementation("io.github.oshai:kotlin-logging-jvm:4.0.0")
  implementation("io.fabric8:kubernetes-client")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("io.strikt:strikt-core:0.34.1")
  testImplementation("org.mockito.kotlin:mockito-kotlin:5.0.0")
  testImplementation("org.testcontainers:testcontainers:1.18.3")
  testImplementation("org.apache.curator:curator-test:5.5.0")
}

dependencyManagement {
  imports {
    mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
  }
}

tasks.withType<KotlinCompile> {
  kotlinOptions {
    freeCompilerArgs += "-Xjsr305=strict"
    jvmTarget = "17"
  }
}

tasks.test {
  useJUnitPlatform()
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

tasks.bootJar {
  archiveFileName.set("agent.jar")
}

springBoot {
  buildInfo()
}

sonar {
  properties {
    property("sonar.projectKey", "ostara-agent")
    property("sonar.organization", "krud-dev")
    property("sonar.host.url", "https://sonarcloud.io")
  }
}
