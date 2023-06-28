package dev.krud.boost.daemon.base.config

import com.fasterxml.jackson.databind.ObjectMapper
import feign.codec.Decoder
import feign.codec.Encoder
import feign.jackson.JacksonDecoder
import feign.jackson.JacksonEncoder
import feign.okhttp.OkHttpClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FeignConfig {
    @Bean
    fun feignHttpClient(): feign.Client {
        return OkHttpClient()
    }

    @Bean
    fun feignEncoder(objectMapper: ObjectMapper): Encoder {
        return JacksonEncoder(objectMapper)
    }

    @Bean
    fun feignDecoder(objectMapper: ObjectMapper): Decoder {
        return JacksonDecoder(objectMapper)
    }
}