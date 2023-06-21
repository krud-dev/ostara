package dev.krud.ostara.inappdemo.log

object LogMessageConstructor {
  private val verbs = listOf(
    "Executing",
    "Getting",
    "Fetching",
    "Loading",
    "Processing",
    "Sending",
    "Receiving",
  )

  private val nouns = listOf(
    "User",
    "Application",
    "Instance"
  )

  private val nounTypes = listOf(
    "Data",
    "Message",
    "Request",
    "Response",
    "Payload",
  )

  fun constructMessage(): String {
    val verb = verbs.random()
    val noun = nouns.random()
    val nounType = nounTypes.random()
    return "$verb the $noun $nounType... (demo)"
  }

}
