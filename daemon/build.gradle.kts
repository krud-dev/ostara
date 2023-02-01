import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    id("org.springframework.boot") version "3.0.2"
    id("io.spring.dependency-management") version "1.1.0"
    kotlin("jvm") version "1.7.22"
    kotlin("plugin.spring") version "1.7.22"
    kotlin("plugin.jpa") version "1.7.22"
}

group = "dev.krud.boost"
version = "0.0.1-SNAPSHOT"

kotlin {
    jvmToolchain(17)
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.hibernate.orm:hibernate-community-dialects")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("org.xerial:sqlite-jdbc:3.40.0.0")
    implementation("com.squareup.okhttp3:okhttp:4.10.0")
    implementation("com.google.code.gson:gson:2.10.1")
    implementation("org.flywaydb:flyway-core:9.12.0")
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.2")
    implementation("dev.krud:crud-framework-core:0.14.0")
    implementation("dev.krud:crud-framework-hibernate5-connector:0.14.0")
    implementation("dev.krud:shapeshift:0.7.0")
    implementation("dev.krud:spring-boot-starter-shapeshift:0.7.0")

    testImplementation("com.squareup.okhttp3:mockwebserver:4.10.0")
    testImplementation("io.strikt:strikt-core:0.34.0")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<BootJar> {
    archiveFileName.set("daemon.jar")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
