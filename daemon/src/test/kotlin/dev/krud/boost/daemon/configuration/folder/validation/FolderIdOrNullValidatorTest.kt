package dev.krud.boost.daemon.configuration.folder.validation

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.stubFolder
import dev.krud.crudframework.crud.handler.krud.Krud
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import strikt.api.expectThat
import strikt.assertions.isFalse
import strikt.assertions.isTrue
import java.util.*

class FolderIdOrNullValidatorTest {
    val folderKrud = mock<Krud<Folder, UUID>>()
    val validator = FolderIdOrNullValidator(folderKrud)

    @Test
    fun `validator should return true if null`() {
        expectThat(validator.isValid(null, mock()))
            .isTrue()
    }

    @Test
    fun `validator should return true if folder exists`() {
        val folder = stubFolder()
        whenever(folderKrud.showById(folder.id))
            .thenReturn(folder)
        expectThat(validator.isValid(folder.id, mock()))
            .isTrue()
    }

    @Test
    fun `validator should return false if folder does not exist`() {
        val folderId = UUID.randomUUID()
        expectThat(validator.isValid(folderId, mock()))
            .isFalse()
    }
}