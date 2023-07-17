import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.tasks.bundling.BootJar
import org.springframework.boot.gradle.tasks.run.BootRun

plugins {
  id("org.springframework.boot") version "3.1.1"
  id("io.spring.dependency-management") version "1.1.1"
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

dependencies {
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  api("org.springframework.boot:spring-boot-starter-actuator")
  compileOnly("org.springframework.boot:spring-boot-starter-web")
  compileOnly("org.springframework.boot:spring-boot-starter-webflux")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.boot:spring-boot-starter-web")
  testImplementation("org.springframework.boot:spring-boot-starter-webflux")
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

tasks.named<BootJar>("bootJar") {
  enabled = false
}

tasks.named<BootRun>("bootRun") {
  enabled = false
}

tasks.named<Jar>("jar") {
  enabled = true
  archiveClassifier.set("")
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
        username.set(properties["ossrhUsername"].toString())
        password.set(properties["ossrhPassword"].toString())
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

  if (!isSnapshot || true) { // Temporary
    val javadocTask = tasks.named<Javadoc>("javadoc").get()

//    tasks.withType<DokkaTask> {
//      javadocTask.dependsOn(this)
//      outputDirectory.set(javadocTask.destinationDir)
//    }
    // TODO: uncomment

    signing {
      useInMemoryPgpKeys(
        properties["signingKey"].toString(),
        properties["signingPassword"].toString(),
      )
      sign(publishing.publications["maven"])
    }
  }
}

tasks.create("printVersion") {
  doLast {
    println(version)
  }
}

sonar {
  properties {
    property("sonar.projectKey", "ostara-spring-client")
    property("sonar.organization", "krud-dev")
    property("sonar.host.url", "https://sonarcloud.io")
  }
}
