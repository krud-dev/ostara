import cz.habarta.typescript.generator.gradle.GenerateTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar
import java.nio.file.Paths

plugins {
    id("org.springframework.boot") version "3.0.2"
    id("io.spring.dependency-management") version "1.1.0"
    kotlin("jvm") version "1.8.10"
    kotlin("plugin.spring") version "1.8.10"
    kotlin("plugin.jpa") version "1.8.10"
    id("cz.habarta.typescript-generator") version "3.1.1185"
}

group = "dev.krud.boost"
version = "0.0.1-SNAPSHOT"

val crudFrameworkVersion = "0.22.0"
val shapeShiftVersion = "0.8.0"

kotlin {
    jvmToolchain(17)
}

repositories {
    mavenCentral()
}

val implementationDev by configurations.creating

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
        outputFile = Paths.get(project.projectDir.path, "..", "src", "common", "generated_definitions.d.ts").toString()
        nullabilityDefinition = cz.habarta.typescript.generator.NullabilityDefinition.undefinedInlineUnion
        mapDate = cz.habarta.typescript.generator.DateMapping.asNumber
    }
}


dependencies {
    implementationDev("org.springframework.boot:spring-boot-starter-actuator")
    implementationDev("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2")

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-integration")
    implementation("org.springframework.boot:spring-boot-starter-cache")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.hibernate.orm:hibernate-community-dialects")
    implementation("org.jetbrains.kotlin:kotlin-stdlib")
    implementation("org.xerial:sqlite-jdbc:3.40.0.0")
    implementation("com.squareup.okhttp3:okhttp:4.10.0")
    implementation("org.flywaydb:flyway-core:9.12.0")
    implementation("dev.krud:crud-framework-core:$crudFrameworkVersion")
    implementation("dev.krud:crud-framework-hibernate5-connector:$crudFrameworkVersion")
    implementation("dev.krud:shapeshift:$shapeShiftVersion")
    implementation("dev.krud:spring-boot-starter-shapeshift:$shapeShiftVersion")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.14.2")
    implementation("com.github.ben-manes.caffeine:caffeine:3.1.3")
    implementation("com.github.wnameless.json:json-flattener:0.16.4")
    implementation("net.pearx.kasechange:kasechange-jvm:1.3.0")
    implementation("io.hypersistence:hypersistence-utils-hibernate-60:3.2.0")
    implementation("com.cobber.fta:fta-core:12.10.2")

    testImplementation("com.squareup.okhttp3:mockwebserver:4.10.0")
    testImplementation("io.strikt:strikt-core:0.34.0")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.mockito.kotlin:mockito-kotlin:4.1.0")

}

tasks.withType<BootJar> {
    archiveFileName.set("daemon.jar")
}

tasks.withType<KotlinCompile> {
    if (!project.hasProperty("prod")) {
        finalizedBy("generateTypeScript")
    }
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "17"
    }
}

noArg {
    invokeInitializers = true
}

tasks.withType<Test> {
    useJUnitPlatform()
}
