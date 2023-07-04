package dev.ostara.agent.filter

import dev.ostara.agent.config.AgentProperties
import dev.ostara.agent.util.AGENT_KEY_HEADER
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class AgentAuthenticationFilter(
  private val agentProperties: AgentProperties
) : OncePerRequestFilter() {
  override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, filterChain: FilterChain) {
    val secure = request.isSecure
    val apiKey = request.getHeader(AGENT_KEY_HEADER)
    if (!secure) {
      if (!apiKey.isNullOrBlank()) {
        response.sendError(HttpStatus.BAD_REQUEST.value(), "$AGENT_KEY_HEADER header is only allowed over https")
      } else {
        filterChain.doFilter(request, response)
      }
      return
    }

    if (apiKey.isNullOrBlank()) {
      response.sendError(HttpStatus.BAD_REQUEST.value(), "$AGENT_KEY_HEADER header is required")
      return
    }

    if (apiKey != agentProperties.apiKey) {
      response.sendError(HttpStatus.UNAUTHORIZED.value(), "$AGENT_KEY_HEADER header is incorrect")
      return
    }
    filterChain.doFilter(request, response)
  }
}
