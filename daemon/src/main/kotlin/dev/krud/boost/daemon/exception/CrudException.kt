package dev.krud.boost.daemon.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus
import java.util.UUID

abstract class CrudException(val resourceName: String, val action: String) : RuntimeException("$resourceName: failed to $action")

@ResponseStatus(value = HttpStatus.NOT_FOUND)
class ResourceNotFoundException(resourceName: String, val resourceId: UUID) : CrudException(resourceName, "find with id $resourceId")

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
class ResourceAlreadyExistsException(resourceName: String, val resourceId: UUID, reason: String? = null) : CrudException(resourceName, "create with ID $resourceId ${resourceId.let { "because $reason" }}")

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
class ResourceNotCreatedException(resourceName: String, reason: String? = null) : CrudException(resourceName, "create ${reason?.let { "because $reason" }}")

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
class ResourceNotUpdatedException(resourceName: String, val resourceId: UUID, reason: String? = null) : CrudException(resourceName, "update with ID $resourceId ${reason?.let { "because $reason" }}")

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
class ResourceNotDeletedException(resourceName: String, val resourceId: UUID, reason: String? = null) : CrudException(resourceName, "delete with ID $resourceId ${reason?.let { "because $reason" }}")