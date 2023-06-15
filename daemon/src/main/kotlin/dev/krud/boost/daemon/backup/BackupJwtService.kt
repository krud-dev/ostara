package dev.krud.boost.daemon.backup

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.fasterxml.jackson.databind.ObjectMapper
import dev.krud.boost.daemon.backup.ro.BackupDTO
import org.springframework.stereotype.Service
import java.util.*

@Service
class BackupJwtService(
    private val objectMapper: ObjectMapper
) {
    private val algorithm = Algorithm.HMAC256(BACKUP_JWT_SECRET)

    private val verifier = JWT.require(algorithm)
        .build()

    fun verify(token: String): BackupDTO {
        val decoded = verifier.verify(token)
        return objectMapper.readValue(
            decoded.getClaim("backup").asString(),
            BackupDTO::class.java
        )
    }

    fun sign(backupDTO: BackupDTO): String {
        return JWT.create()
            .withIssuedAt(Date())
            .withClaim(
                "backup",
                objectMapper.writeValueAsString(backupDTO)
            )
            .sign(algorithm)
    }

    companion object {
        // For validation purposes only, not sensitive
        internal const val BACKUP_JWT_SECRET = "ostara"
    }
}