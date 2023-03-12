package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.crudframework.crud.handler.krud.Krud
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.springframework.web.server.ResponseStatusException
import strikt.api.expect
import strikt.api.expectThrows
import strikt.assertions.isEqualTo
import java.util.*

class FolderServiceTest {
    private val folderKrud: Krud<Folder, UUID> = mock()

    @Test
    fun `getFolder should return folder`() {
        val folder = stubFolder()
        whenever(folderKrud.showById(folder.id)).thenReturn(folder)
        val folderService = FolderService(folderKrud)
        val result = folderService.getFolder(folder.id)

        expect {
            that(result) isEqualTo folder
        }
    }

    @Test
    fun `getFolderOrThrow should return folder`() {
        val folder = stubFolder()
        whenever(folderKrud.showById(folder.id)).thenReturn(folder)
        val folderService = FolderService(folderKrud)
        val result = folderService.getFolderOrThrow(folder.id)

        expect {
            that(result) isEqualTo folder
        }
    }

    @Test
    fun `getFolderOrThrow should throw not found`() {
        val folderUuid = UUID.randomUUID()
        val folderService = FolderService(folderKrud)
        val exception = expectThrows<ResponseStatusException> {
            folderService.getFolderOrThrow(folderUuid)
        }
            .subject
        expect {
            that(exception.statusCode.value()) isEqualTo 404
            that(exception.message) isEqualTo "404 NOT_FOUND \"Folder $folderUuid not found\""
        }
    }

    @Test
    fun `moveFolder should move folder`() {
        val folder = stubFolder()
        val newParentFolderId: UUID? = null
        val newSort = 1.0
        whenever(folderKrud.showById(folder.id)).thenReturn(folder)
        whenever(folderKrud.update(folder)).thenReturn(folder)
        val folderService = FolderService(folderKrud)
        val result = folderService.moveFolder(folder.id, newParentFolderId, newSort)

        expect {
            that(result) isEqualTo folder
        }
    }

    @Test
    fun `moveFolder should throw not found`() {
        val folderUuid = UUID.randomUUID()
        val folderService = FolderService(folderKrud)
        val exception = expectThrows<ResponseStatusException> {
            folderService.moveFolder(folderUuid, null, null)
        }
            .subject
        expect {
            that(exception.statusCode.value()) isEqualTo 404
            that(exception.message) isEqualTo "404 NOT_FOUND \"Folder ${folderUuid} not found\""
        }
    }
}