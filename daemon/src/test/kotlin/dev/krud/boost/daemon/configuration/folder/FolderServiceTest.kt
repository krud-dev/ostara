package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.crudframework.crud.handler.krud.Krud
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.springframework.web.server.ResponseStatusException
import strikt.api.expectThat
import strikt.api.expectThrows
import strikt.assertions.isEqualTo
import strikt.assertions.isNull
import java.util.*

class FolderServiceTest {
    val folderKrud = mock<Krud<Folder, UUID>>()
    val folderService = FolderService(folderKrud)

    @Test
    fun `getFolder should return null if folder not found`() {
        expectThat(folderService.getFolder(UUID.randomUUID()))
            .isNull()
    }

    @Test
    fun `getFolder should return folder if found`() {
        val folder = stubFolder()
        whenever(folderKrud.showById(folder.id))
            .thenReturn(folder)
        val result = folderService.getFolder(folder.id)
        expectThat(result)
            .isEqualTo(folder)
    }

    @Test
    fun `getFolderOrThrow should throw if folder not found`() {
        expectThrows<ResponseStatusException> {
            folderService.getFolderOrThrow(UUID.randomUUID())
        }
            .and {
                get { statusCode.value() }.isEqualTo(404)
            }
    }

    @Test
    fun `getFolderOrThrow should return folder if found`() {
        val folder = stubFolder()
        whenever(folderKrud.showById(folder.id))
            .thenReturn(folder)
        val result = folderService.getFolderOrThrow(folder.id)
        expectThat(result)
            .isEqualTo(folder)
    }

    @Test
    fun `moveFolder should update folder`() {
        val folder = stubFolder()
        val newParentFolderId = UUID.randomUUID()
        val newSort = 1.0
        whenever(folderKrud.showById(folder.id))
            .thenReturn(folder)
        whenever(folderKrud.update(folder))
            .thenReturn(folder)
        val result = folderService.moveFolder(folder.id, newParentFolderId, newSort)
        expectThat(result)
            .isEqualTo(folder)
        expectThat(folder.parentFolderId)
            .isEqualTo(newParentFolderId)
        expectThat(folder.sort)
            .isEqualTo(newSort)
    }
}