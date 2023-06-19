package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.Agent
import feign.codec.Decoder
import feign.codec.Encoder
import org.springframework.stereotype.Service

@Service
class AgentClientProvider(
    private val feignEncoder: Encoder,
    private val feignDecoder: Decoder,
    private val feignHttpClient: feign.Client
) {
    fun getAgentClient(agent: Agent): AgentClient {
        return feign.Feign.builder()
            .client(feignHttpClient)
            .encoder(feignEncoder)
            .decoder(feignDecoder)
            .target(AgentClient::class.java, agent.url)
    }
}