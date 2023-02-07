package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.exception.ResourceNotCreatedException
import dev.krud.boost.daemon.exception.ResourceNotDeletedException
import dev.krud.boost.daemon.exception.ResourceNotFoundException
import dev.krud.boost.daemon.exception.ResourceNotUpdatedException
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.RequestBody
import java.util.*

@Service
class FolderService(
    private val folderDao: FolderDao
) {
    @Transactional(readOnly = false)
    @Throws(ResourceNotCreatedException::class)
    fun createFolder(folder: Folder): Folder {
        if (folder.exists()) {
            throw ResourceNotCreatedException(Folder.NAME, "it already exists")
        }
        return try {
            folderDao.save(folder)
        } catch (e: Throwable) {
            throw ResourceNotCreatedException(Folder.NAME, e.message).initCause(e)
        }
    }

    @Transactional(readOnly = false)
    @Throws(ResourceNotUpdatedException::class, ResourceNotFoundException::class)
    fun updateFolder(id: UUID, folder: Folder): Folder {
        return try {
            folderDao.save(folder)
        } catch (e: Throwable) {
            when (e) {
                is EmptyResultDataAccessException -> throw ResourceNotFoundException(Folder.NAME, id)
                else -> throw ResourceNotUpdatedException(Folder.NAME, id, e.message).initCause(e)
            }
        }
    }

    @Transactional(readOnly = false)
    @Throws(ResourceNotDeletedException::class, ResourceNotFoundException::class)
    fun deleteFolder(id: UUID) {
        return try {
            folderDao.deleteById(id)
        } catch (e: Throwable) {
            when (e) {
                is EmptyResultDataAccessException -> throw ResourceNotFoundException(Folder.NAME, id)
                else -> throw ResourceNotDeletedException(Folder.NAME, id, e.message).initCause(e)
            }
        }
    }

    @Transactional(readOnly = true)
    fun getFolders(pageable: Pageable): Page<Folder> {
        return folderDao.findAll(pageable)
    }

    @Transactional(readOnly = true)
    @Throws(ResourceNotFoundException::class)
    fun getFolder(id: UUID): Folder {
        return folderDao.findById(id)
            .orElseThrow { ResourceNotFoundException(Folder.NAME, id) }
    }
}