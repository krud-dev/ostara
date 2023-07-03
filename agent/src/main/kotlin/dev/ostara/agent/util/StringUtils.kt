package dev.ostara.agent.util

fun String.ensurePrefix(prefix: String): String {
  return if (this.startsWith(prefix)) {
    this
  } else {
    prefix + this
  }
}

fun String.ensureSuffix(suffix: String): String {
  return if (this.endsWith(suffix)) {
    this
  } else {
    this + suffix
  }
}
