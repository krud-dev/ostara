package dev.krud.boost.daemon.actuator.model

data class MappingsActuatorResponse(
    val contexts: Map<String, Context>
) {
    data class Context(
        val mappings: Mappings,
        val parentId: String?
    ) {
        data class Mappings(
            val dispatcherServlets: Map<String, List<DispatcherServletOrHandler>>,
            val servletFilters: List<ServletFilter>,
            val servlets: List<Servlet>,
            val dispatcherHandlers: Map<String, List<DispatcherServletOrHandler>>?
        ) {
            data class DispatcherServletOrHandler(
                val handler: String,
                val predicate: String,
                val details: Details?
            ) {
                data class Details(
                    val handlerMethod: HandlerMethod?,
                    val handlerFunction: HandlerFunction?,
                    val requestMappingConditions: RequestMappingConditions?
                ) {
                    data class HandlerMethod(
                        val className: String,
                        val name: String,
                        val descriptor: String
                    )

                    data class HandlerFunction(
                        val className: String
                    )

                    data class RequestMappingConditions(
                        val consumes: List<MediaType>,
                        val headers: List<Header>,
                        val methods: List<String>,
                        val params: List<Param>,
                        val patterns: List<String>,
                        val produces: List<MediaType>
                    ) {
                        data class MediaType(
                            val mediaType: String,
                            val negated: Boolean
                        )

                        data class Header(
                            val name: String,
                            val value: String
                        )

                        data class Param(
                            val name: String,
                            val value: String
                        )
                    }
                }
            }

            data class ServletFilter(
                val servletNameMappings: List<String>,
                val urlPatternMappings: List<String>,
                val name: String,
                val className: String
            )

            data class Servlet(
                val mappings: List<String>,
                val name: String,
                val className: String
            )
        }
    }
}