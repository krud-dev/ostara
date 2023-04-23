package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class MappingsActuatorResponse(
    val contexts: Map<String, Context> = emptyMap()
) {
    data class Context(
        val mappings: Mappings = Mappings(),
        val parentId: String? = null
    ) {
        data class Mappings(
            val dispatcherServlets: Map<String, List<DispatcherServletOrHandler>>? = null,
            val servletFilters: List<ServletFilter> = emptyList(),
            val servlets: List<Servlet> = emptyList(),
            val dispatcherHandlers: Map<String, List<DispatcherServletOrHandler>>? = null
        ) {
            data class DispatcherServletOrHandler(
                val handler: String = TypeDefaults.STRING,
                val predicate: String = TypeDefaults.STRING,
                val details: Details? = null
            ) {
                data class Details(
                    val handlerMethod: HandlerMethod? = null,
                    val handlerFunction: HandlerFunction? = null,
                    val requestMappingConditions: RequestMappingConditions? = null
                ) {
                    data class HandlerMethod(
                        val className: String = TypeDefaults.STRING,
                        val name: String = TypeDefaults.STRING,
                        val descriptor: String = TypeDefaults.STRING
                    )

                    data class HandlerFunction(
                        val className: String = TypeDefaults.STRING
                    )

                    data class RequestMappingConditions(
                        val consumes: List<MediaType> = emptyList(),
                        val headers: List<Header> = emptyList(),
                        val methods: List<String> = emptyList(),
                        val params: List<Param> = emptyList(),
                        val patterns: List<String> = emptyList(),
                        val produces: List<MediaType> = emptyList()
                    ) {
                        data class MediaType(
                            val mediaType: String = TypeDefaults.STRING,
                            val negated: Boolean = TypeDefaults.BOOLEAN
                        )

                        data class Header(
                            val name: String = TypeDefaults.STRING,
                            val value: String = TypeDefaults.STRING
                        )

                        data class Param(
                            val name: String = TypeDefaults.STRING,
                            val value: String = TypeDefaults.STRING
                        )
                    }
                }
            }

            data class ServletFilter(
                val servletNameMappings: List<String> = emptyList(),
                val urlPatternMappings: List<String> = emptyList(),
                val name: String = TypeDefaults.STRING,
                val className: String = TypeDefaults.STRING
            )

            data class Servlet(
                val mappings: List<String> = emptyList(),
                val name: String = TypeDefaults.STRING,
                val className: String = TypeDefaults.STRING
            )
        }
    }
}