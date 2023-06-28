package dev.ostara.agent.util

inline fun <reified T : Enum<T>> valueOfOrNull(name: String?): Enum<T>? {
  name ?: return null
  return T::class.java.enumConstants?.find { it.name == name }
}
