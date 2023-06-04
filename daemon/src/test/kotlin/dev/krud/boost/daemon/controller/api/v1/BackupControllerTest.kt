package dev.krud.boost.daemon.controller.api.v1

import com.fasterxml.jackson.databind.ObjectMapper
import dev.krud.boost.daemon.backup.BackupService
import dev.krud.boost.daemon.backup.stubBackupDTO
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

@WebMvcTest(BackupController::class)
class BackupControllerTest {
    @MockBean
    private lateinit var backupService: BackupService

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var mockMvc: MockMvc

    private val baseUrlProvider: () -> String = {
        "/api/v1/backup/"
    }

    @Test
    fun `exportAll should return export on invocation`() {
        val backupDto = stubBackupDTO()
        whenever(backupService.exportAll()).thenReturn(backupDto)
        val baseUrl = baseUrlProvider() + "exportAll"
        mockMvc.perform(
            MockMvcRequestBuilders.post(baseUrl)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(content().string(objectMapper.writeValueAsString(backupDto)))
    }

    @Test
    fun `importAll should return 201 on invocation`() {
        val backupDto = stubBackupDTO()
        val jsonNode = objectMapper.readTree(objectMapper.writeValueAsString(backupDto))
        val baseUrl = baseUrlProvider() + "importAll"
        mockMvc.perform(
            MockMvcRequestBuilders.post(baseUrl)
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(backupDto))
        )
            .andExpect(status().isCreated)
        verify(backupService, times(1)).importAll(jsonNode)
    }
}