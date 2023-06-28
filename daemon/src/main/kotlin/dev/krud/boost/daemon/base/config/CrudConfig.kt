package dev.krud.boost.daemon.base.config

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.crudframework.crud.handler.krud.EnableKrud
import dev.krud.crudframework.crud.policy.policy
import dev.krud.crudframework.crud.security.PrincipalProvider
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.security.Principal

@Configuration
@EnableKrud(["dev.krud.boost.daemon"])
class CrudConfig {
    @Bean
    fun defaultPrincipalProvider(): PrincipalProvider {
        return object : PrincipalProvider {
            override fun getPrincipal(): Principal? {
                return null
            }
        }
    }
    @Configuration
    class Policies {
        @Bean
        fun instancePolicy() = policy<Instance> {
            canDelete("disallow demo instance deletion") {
                postCondition { instance, _ ->
                    !instance.demo
                }
            }

            canDelete("disallow discovered instance deletion") {
                postCondition { instance, _ ->
                    !instance.discovered
                }
            }

            canUpdate("disallow demo instance update") {
                postCondition { instance, _ ->
                    !instance.demo
                }
            }

            canUpdate("disallow discovered instance update") {
                postCondition { instance, _ ->
                    !instance.discovered
                }
            }
        }

        @Bean
        fun applicationPolicy() = policy<Application> {
            canUpdate("disallow demo application update") {
                postCondition { application, _ ->
                    !application.demo
                }
            }
        }
    }
}