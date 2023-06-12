package dev.krud.boost.daemon.actuator.jackson

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.databind.node.ObjectNode
import dev.krud.boost.daemon.actuator.model.InfoActuatorResponse

class GitDeserializer : StdDeserializer<InfoActuatorResponse.Git>(InfoActuatorResponse.Git::class.java) {
    override fun deserialize(parser: JsonParser, ctxt: DeserializationContext): InfoActuatorResponse.Git {
        val tree = parser.codec.readTree<ObjectNode>(parser)
        if (!tree.has("type")) {
            tree.setTypeByMarker()
        }
        return parser.deserializeWithGitType(tree)
    }

    private fun JsonParser.deserializeWithGitType(tree: ObjectNode): InfoActuatorResponse.Git {
        val type = tree.get("type").asText()
        return when (type) {
            "simple" -> {
                this.codec.treeToValue(tree, InfoActuatorResponse.Git.Simple::class.java)
            }

            "full" -> {
                this.codec.treeToValue(tree, InfoActuatorResponse.Git.Full::class.java)
            }

            else -> {
                InfoActuatorResponse.Git.Unknown
            }
        }
    }

    private fun ObjectNode.setTypeByMarker() {
        val id = this
            .get("commit")
            ?.get("id")
        if (id == null || id.isNull) {
            this.put("type", "unknown")
            return
        }
        val type =  if (id.isObject) {
            "full"
        } else if (id.isTextual) {
            "simple"
        } else {
            "unknown"
        }
        this.put("type", type)
    }
}