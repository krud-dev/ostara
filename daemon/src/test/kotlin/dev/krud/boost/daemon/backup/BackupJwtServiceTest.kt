package dev.krud.boost.daemon.backup

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.SignatureVerificationException
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dev.krud.boost.daemon.backup.ro.BackupDTO
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import strikt.api.expect
import strikt.api.expectThrows
import strikt.assertions.isEqualTo
import strikt.assertions.isNotEqualTo
import java.util.*

class BackupJwtServiceTest {
    private val backupParser = mock<BackupParser>()
    private val backupJwtService = BackupJwtService(
        jacksonObjectMapper(),
        backupParser
    )

    @Test
    fun `should produce a valid jwt with the backup`() {
        val verifier = JWT.require(
            Algorithm.HMAC256("ostara")
        )
            .build()
        val backupDTO = BackupDTO(
            version = 0,
            date = Date(0),
            tree = emptyList()
        )
        val token = backupJwtService.sign(backupDTO)
        val decoded = verifier.verify(token)
        expect {
            that(decoded.algorithm).isEqualTo("HS256")
            that(decoded.type).isEqualTo("JWT")
            that(decoded.issuedAt).isNotEqualTo(null)
            that(decoded.getClaim("backup").asString()).isEqualTo(
                """
                {"version":0,"date":0,"tree":[]}
                """.trimIndent()
            )
        }
    }

    @Test
    fun `verify should return a valid backup`() {
        val token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODY2NDA4MzAsImJhY2t1cCI6IntcInZlcnNpb25cIjowLFwiZGF0ZVwiOjAsXCJ0cmVlXCI6W119In0.8z0WwjMemJTt1VUCP4FHg2I0g8_fnQkt0ARyd8FaBW0"
        whenever(backupParser.parse("""{"version":0,"date":0,"tree":[]}"""))
            .thenReturn(BackupDTO(0, Date(0), emptyList()))
        val backup = backupJwtService.verify(token)
        expect {
            that(backup.tree).isEqualTo(emptyList())
            that(backup.version).isEqualTo(0)
            that(backup.date).isEqualTo(Date(0))
        }
    }

    @Test
    fun `verify should throw if token signature is invalid`() {
        val token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODY2NDA4MzAsImJhY2t1cCI6IntcInZlcnNpb25cIjowLFwiZGF0ZVwiOjAsXCJ0cmVlXCI6W119In0.nKc-Yzg4wG4USRb9-vQufrLpYiuhAUzzJhnBmiOttYA"
        expectThrows<SignatureVerificationException> {
            backupJwtService.verify(token)
        }
    }
}