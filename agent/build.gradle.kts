import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  id("org.springframework.boot") version "3.1.1"
  id("io.spring.dependency-management") version "1.1.0"
  kotlin("jvm") version "1.9.0"
  kotlin("plugin.spring") version "1.9.0"
  jacoco
  id("org.sonarqube") version "4.2.1.3168"
  `maven-publish`
  id("io.github.gradle-nexus.publish-plugin") version "2.0.0-rc-1"
  signing
  id("org.jetbrains.dokka") version "1.8.20"
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
  implementation("io.github.oshai:kotlin-logging-jvm:4.0.2")
  implementation("io.fabric8:kubernetes-client")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("io.strikt:strikt-core:0.34.1")
  testImplementation("org.mockito.kotlin:mockito-kotlin:5.0.0")
  testImplementation("org.testcontainers:testcontainers:1.18.3")
  testImplementation("org.apache.curator:curator-test:5.5.0")
  testImplementation("io.fabric8:kubernetes-server-mock")
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

if (hasProperty("release")) {
  val effectiveVersion = (findProperty("releaseVersion") ?: version).toString()
  val isSnapshot = version.toString().endsWith("-SNAPSHOT")
  if (!isSnapshot) {
    java {
      withJavadocJar()
      withSourcesJar()
    }
  }

  nexusPublishing {
    this@nexusPublishing.repositories {
      sonatype {
        username.set(extra["ossrhUsername"].toString())
        password.set(extra["ossrhPassword"].toString())
        nexusUrl.set(uri("https://s01.oss.sonatype.org/service/local/"))
        snapshotRepositoryUrl.set(uri("https://s01.oss.sonatype.org/content/repositories/snapshots/"))
      }
    }
  }

  publishing {
    publications.create<MavenPublication>("maven") {
      from(components["java"])
      version = effectiveVersion
      pom {
        version = effectiveVersion
        description.set("The Spring Client for Ostara, a cross-platform desktop app for managing and monitoring Spring Boot applications using the Actuator API, providing comprehensive insights and effortless control.")
        url.set("https://github.com/krud-dev/ostara")
        licenses {
          license {
            name.set("Apache 2.0 License")
            url.set("https://github.com/krud-dev/ostara/blob/master/LICENSE")
          }
        }

        developers {
          developer {
            name.set("KRUD")
            email.set("admin@krud.dev")
            organization.set("KRUD")
            organizationUrl.set("https://www.krud.dev")
          }
        }

        scm {
          connection.set("scm:git:git://github.com/krud-dev/ostara.git")
          developerConnection.set("scm:git:ssh://git@github.com/krud-dev/ostara.git")
          url.set("https://github.com/krud-dev/ostara")
        }
      }
    }
  }

  if (!isSnapshot) {
    val javadocTask = tasks.named<Javadoc>("javadoc").get()

    tasks.withType<DokkaTask> {
      javadocTask.dependsOn(this)
      outputDirectory.set(javadocTask.destinationDir)
    }

    signing {
      useInMemoryPgpKeys(
        extra["signingKey"].toString(),
        extra["signingKeyId"].toString(),
        extra["signingPassword"].toString(),
      )
      if (!isSnapshot) {
        sign(publishing.publications["maven"])
      }
    }
  }
}

tasks.create("printVersion") {
  doLast {
    println(version)
  }
}
