package dev.krud.boost.daemon.configuration.instance.heapdump.store

import dev.krud.boost.daemon.base.config.AppMainProperties
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
        val path = Path(
            appMainProperties.heapdumpDirectory,
            "$referenceId.hprof"
        )
        path.parent.createDirectories()
        val size = path.toFile().outputStream().use { heapdump.copyTo(it) }
        InstanceHeapdumpStore.StoreHeapdumpResult(
            path.toString(),
            size
        )
    }

    override fun getHeapdump(referenceId: UUID): Result<InputStream> = runCatching {
        Path(
            appMainProperties.heapdumpDirectory,
            "$referenceId.hprof"
        ).toFile().inputStream()
    }

    override fun deleteHeapdump(referenceId: UUID): Result<Unit> = runCatching {
        Path(
            appMainProperties.heapdumpDirectory,
            "$referenceId.hprof"
        )
            .toFile()
            .delete()
    }
}