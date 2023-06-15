package dev.krud.boost.daemon.controller.api.v1

import com.fasterxml.jackson.databind.ObjectMapper
import dev.krud.boost.daemon.backup.SystemBackupService
import dev.krud.boost.daemon.backup.ro.BackupDTO
import dev.krud.boost.daemon.backup.ro.SystemBackupRO
import dev.krud.boost.daemon.exception.throwNotFound
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.util.*

@WebMvcTest(SystemBackupController::class)
class SystemBackupControllerTest {
    @MockBean
    private lateinit var systemBackupService: SystemBackupService

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var mockMvc: MockMvc

    private val baseUrlProvider: () -> String = {
        "/api/v1/systemBackup/"
    }

    @Test
    fun `listSystemBackups should return list of non-failing backups`() {
        val ro = SystemBackupRO(
            fileName = "backup-manual-1.gz",
            date = Date(),
            valid = true
        )
        whenever(systemBackupService.listSystemBackups(false)).thenReturn(
            Result.success(listOf(ro))
        )
        val baseUrl = baseUrlProvider()
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl).queryParam("includeFailures", "false")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(content().string(objectMapper.writeValueAsString(listOf(ro))))
    }


    @Test
    fun `listSystemBackups should return list of all backups`() {
        val ro = SystemBackupRO(
            fileName = "backup-manual-1.gz",
            date = Date(),
            valid = false
        )
        whenever(systemBackupService.listSystemBackups(true)).thenReturn(
            Result.success(listOf(ro))
        )
        val baseUrl = baseUrlProvider()
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl).queryParam("includeFailures", "true")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(content().string(objectMapper.writeValueAsString(listOf(ro))))
    }

    @Test
    fun `deleteSystemBackup should return 204 on success`() {
        val baseUrl = baseUrlProvider() + "delete"
        mockMvc.perform(
            MockMvcRequestBuilders.delete(baseUrl).queryParam("fileName", "backup-manual-1.gz")
        )
            .andExpect(status().isNoContent)
        verify(systemBackupService, times(1)).deleteSystemBackup("backup-manual-1.gz")
    }

    @Test
    fun `createSystemBackup should return 201 on success`() {
        val ro = SystemBackupRO(
            fileName = "backup-manual-1.gz",
            date = Date(),
            valid = false
        )
        whenever(systemBackupService.createSystemBackup(false)).thenReturn(
            Result.success(ro)
        )
        val baseUrl = baseUrlProvider() + "create"
        mockMvc.perform(
            MockMvcRequestBuilders.post(baseUrl)
        )
            .andExpect(status().isCreated)
            .andExpect(content().contentType("application/json"))
            .andExpect(content().string(objectMapper.writeValueAsString(ro)))
    }

    @Test
    fun `getSystemBackup should return the system backup DTO`() {
        val dto = BackupDTO(1, Date(0), emptyList())
        whenever(systemBackupService.getSystemBackupDto("backup-manual-1.gz")).thenReturn(
            Result.success(dto)
        )
        val baseUrl = baseUrlProvider() + "show"
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl).queryParam("fileName", "backup-manual-1.gz")
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(content().string(objectMapper.writeValueAsString(dto)))
    }

    @Test
    fun `getSystemBackup should return 404 if backup not found`() {
        whenever(systemBackupService.getSystemBackupDto("backup-manual-1.gz")).then {
            throwNotFound("Backup not found")
        }
        val baseUrl = baseUrlProvider() + "show"
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl).queryParam("fileName", "backup-manual-1.gz")
        )
            .andExpect(status().isNotFound)
    }
}