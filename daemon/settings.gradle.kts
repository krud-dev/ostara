rootProject.name = "daemon"

val useCrudLocal = extra.has("use.crud.local")
if (useCrudLocal) {
    includeBuild("../../crud-framework") {
        dependencySubstitution {
            substitute(module("dev.krud:crud-framework-core")).using(project(":crud-framework-core"))
            substitute(module("dev.krud:crud-framework-web")).using(project(":crud-framework-web"))
            substitute(module("dev.krud:crud-framework-hibernate5-connector")).using(project(":crud-framework-hibernate5-connector"))
            substitute(module("dev.krud:crud-framework-mongo-connector")).using(project(":crud-framework-mongo-connector"))
        }
    }

}