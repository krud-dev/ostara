package dev.ostara.agent.util

fun String.ensureSuffix(suffix: String): String {
  return if (this.endsWith(suffix)) {
    this
  } else {
    this + suffix
  }
}
