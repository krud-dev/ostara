package dev.ostara.agent.service

import org.springframework.stereotype.Service

@Service
class TimeService {
  fun currentTimeMillis(): Long {
    return System.currentTimeMillis()
  }
}
