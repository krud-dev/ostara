package dev.krud.boost.daemon.configuration.instance.heapdump.store

import dev.krud.boost.daemon.base.config.AppMainProperties
import dev.krud.boost.daemon.exception.throwInternalServerError
import io.github.oshai.KotlinLogging
import org.springframework.stereotype.Component
import java.io.InputStream
import java.util.*
import kotlin.io.path.Path
import kotlin.io.path.createDirectories

@Component
class LocalInstanceHeapdumpStoreImpl(
    private val appMainProperties: AppMainProperties
) : InstanceHeapdumpStore {
    override val type = "local"

    override fun storeHeapdump(referenceId: UUID, heapdump: InputStream): Result<InstanceHeapdumpStore.StoreHeapdumpResult> = runCatching {
        log.debug {
            "Storing heapdump for reference $referenceId"
        }
        val path = Path(
            appMainProperties.heapdumpDirectory,
            "$referenceId.hprof"
        )
        path.parent.createDirectories()
        val size = path.toFile().outputStream().use { heapdump.copyTo(it) }
        InstanceHeapdumpStore.StoreHeapdumpResult(
            path.toString(),
            size
        ).apply {
            log.debug {
                "Stored heapdump for reference $referenceId at $path"
            }
        }
    }

    override fun getHeapdump(referenceId: UUID): Result<InputStream> = runCatching {
        val path = Path(
            appMainProperties.heapdumpDirectory,
            "$referenceId.hprof"
        )
        log.debug {
            "Getting heapdump for reference $referenceId at $path"
        }
        path.toFile().inputStream()
    }

    override fun deleteHeapdump(referenceId: UUID): Result<Unit> = runCatching {
        val path = Path(
            appMainProperties.heapdumpDirectory,
            "$referenceId.hprof"
        )
        log.debug {
            "Deleting heapdump for reference $referenceId at $path"
        }
        val success = path
            .toFile()
            .delete()
        if (!success) {
            throwInternalServerError("Failed to delete heapdump for reference $referenceId at $path")
        }
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}