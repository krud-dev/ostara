import cz.habarta.typescript.generator.gradle.GenerateTask
import java.nio.file.Paths

plugins {
    id("org.springframework.boot") version "3.0.2"
    id("io.spring.dependency-management") version "1.1.0"
    kotlin("jvm") version "1.8.22"
    kotlin("plugin.spring") version "1.8.22"
    kotlin("plugin.jpa") version "1.8.22"
    kotlin("kapt") version "1.8.22"
    id("cz.habarta.typescript-generator") version "3.2.1263"
    jacoco
    id("org.sonarqube") version "3.5.0.2730"
}

group = "dev.krud.boost"
version = "0.0.1-SNAPSHOT"

val crudFrameworkVersion = "0.25.0"
val shapeShiftVersion = "0.8.0"

kotlin {
    jvmToolchain(17)
}

repositories {
    mavenCentral()
}

val implementationDev by configurations.creating
val implementationProd by configurations.creating

if (!project.hasProperty("prod")) {
    configurations {
        implementation {
            extendsFrom(implementationDev)
        }
    }

    tasks.withType<GenerateTask> {
        jsonLibrary = cz.habarta.typescript.generator.JsonLibrary.jackson2
        classPatterns = listOf(
            "dev.krud.boost.**.*RO",
            "dev.krud.boost.daemon.actuator.model.*"
        )
        excludeClasses = listOf(
            "java.io.Serializable",
        )
        classes = listOf(
            "dev.krud.crudframework.modelfilter.DynamicModelFilter",
            "dev.krud.crudframework.ro.PagedResult",
        )
        classesWithAnnotations = listOf(
            "dev.krud.boost.daemon.base.annotations.GenerateTypescript"
        )
        val classDelimiter = '$'
        customTypeNamingFunction = """
        (name, simpleName) => name.split('.').pop().replaceAll('$', '${classDelimiter}')
    """.trimIndent()
        noFileComment = true
        outputKind = cz.habarta.typescript.generator.TypeScriptOutputKind.module
        outputFile = Paths.get(project.projectDir.path, "..", "app", "src", "common", "generated_definitions.d.ts").toString()
        nullabilityDefinition = cz.habarta.typescript.generator.NullabilityDefinition.undefinedInlineUnion
        mapDate = cz.habarta.typescript.generator.DateMapping.asNumber
    }
} else {
    configurations {
        implementation {
            extendsFrom(implementationProd)
        }
    }
}


dependencies {
    kapt("org.springframework.boot:spring-boot-configuration-processor")

    implementationDev("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2")
    implementationDev("org.xerial:sqlite-jdbc:3.40.0.0")

    implementationProd(files("lib/sqlite-jdbc-3.40.0.0.jar"))

    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-integration")
    implementation("org.springframework.boot:spring-boot-starter-cache")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework:spring-context-indexer")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.hibernate.orm:hibernate-community-dialects")
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("com.squareup.okhttp3:okhttp:4.11.0")
    implementation("org.flywaydb:flyway-core:9.12.0")
    implementation("dev.krud:crud-framework-core:$crudFrameworkVersion")
    implementation("dev.krud:crud-framework-hibernate5-connector:$crudFrameworkVersion")
    implementation("dev.krud:shapeshift:$shapeShiftVersion")
    implementation("dev.krud:spring-boot-starter-shapeshift:$shapeShiftVersion")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.15.2")
    implementation("com.github.ben-manes.caffeine:caffeine:3.1.3")
    implementation("com.github.wnameless.json:json-flattener:0.16.4")
    implementation("net.pearx.kasechange:kasechange-jvm:1.3.0")
    implementation("io.hypersistence:hypersistence-utils-hibernate-60:3.2.0")
    implementation("com.cobber.fta:fta-core:12.10.2")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.0-Beta")
    implementation("io.github.oshai:kotlin-logging-jvm:4.0.0-beta-22")

    // Added separately from springdoc for production builds
    implementation("io.swagger.core.v3:swagger-annotations-jakarta:2.2.11")

    implementation("io.sentry:sentry-spring-boot-starter-jakarta:6.22.0")


    testImplementation("com.squareup.okhttp3:mockwebserver:4.11.0")
    testImplementation("io.strikt:strikt-core:0.34.1")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.0.0")

}

noArg {
    invokeInitializers = true
}

tasks.bootJar {
    archiveFileName.set("daemon.jar")
}

tasks.compileKotlin {
    if (!project.hasProperty("prod")) {
        finalizedBy("generateTypeScript")
    }
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "17"
    }
}

tasks.test {
    useJUnitPlatform()
    finalizedBy(tasks.jacocoTestReport)
}

tasks.jacocoTestReport {
    dependsOn(tasks.test)
    reports {
        xml.required.set(true)
        html.required.set(false)
    }
}


sonar {
    properties {
        property("sonar.projectKey", "ostara-daemon")
        property("sonar.organization", "krud-dev")
        property("sonar.host.url", "https://sonarcloud.io")
    }
}
