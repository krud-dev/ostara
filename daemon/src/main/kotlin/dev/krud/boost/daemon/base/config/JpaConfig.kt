package dev.krud.boost.daemon.base.config

import dev.krud.crudframework.crud.handler.krud.EnableKrud
import dev.krud.crudframework.jpa.annotation.EnableJpaCrud
import org.springframework.context.annotation.Configuration

@Configuration
@EnableJpaCrud
@EnableKrud
class JpaConfig