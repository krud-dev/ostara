import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  id("org.springframework.boot") version "3.1.1"
  id("io.spring.dependency-management") version "1.1.0"
  kotlin("jvm") version "1.8.22"
  kotlin("plugin.spring") version "1.8.22"
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
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-actuator")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
//  implementation("org.springframework.cloud:spring-cloud-starter-consul-discovery")
  implementation("io.github.oshai:kotlin-logging-jvm:4.0.0")
  implementation("io.kubernetes:client-java:18.0.0") {
    exclude(group = "org.slf4j", module = "slf4j-api")
  }
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("io.strikt:strikt-core:0.34.1")
  testImplementation("org.mockito.kotlin:mockito-kotlin:5.0.0")
}

dependencyManagement {
  imports {
    mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
  }
}

springBoot {
  buildInfo()
}

tasks.withType<KotlinCompile> {
  kotlinOptions {
    freeCompilerArgs += "-Xjsr305=strict"
    jvmTarget = "17"
  }
}

tasks.withType<Test> {
  useJUnitPlatform()
}
