package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.backup.migration.BackupMigration
import dev.krud.boost.daemon.backup.migration.BackupMigration.Companion.getLatestVersion
import dev.krud.boost.daemon.backup.ro.BackupDTO
import dev.krud.boost.daemon.backup.ro.BackupDTO.Companion.toTreeElement
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.utils.searchSequence
import dev.krud.crudframework.crud.handler.krud.Krud
import org.springframework.stereotype.Component
import java.util.*

@Component
class BackupExporter(
    private val backupMigrations: List<BackupMigration>,
    private val folderKrud: Krud<Folder, UUID>,
    private val applicationKrud: Krud<Application, UUID>,
    private val instanceKrud: Krud<Instance, UUID>,
    private val agentKrud: Krud<Agent, UUID>,
    private val applicationMetricRuleKrud: Krud<ApplicationMetricRule, UUID>
) {
    fun exportAll(): BackupDTO {
        val rootFolders = getFolders()
            .map {
                buildFolderTreeElement(it)
            }
        val rootApplications = getApplications()
            .map {
                buildApplicationTreeElement(it)
            }
        val rootAgents = getAgents()
            .map {
                buildAgentTreeElement(it)
            }
        return BackupDTO(
            version = backupMigrations.getLatestVersion(),
            tree = (rootFolders + rootApplications + rootAgents).toList(),
            date = Date()
        )

    }

    private fun buildFolderTreeElement(folder: Folder): BackupDTO.TreeElement.Folder {
        val treeElement = folder.toTreeElement()
            .apply {
                children = getFolders(folder.id)
                    .map { buildFolderTreeElement(it) }
                    .toList() +
                        getApplications(folder.id).map { buildApplicationTreeElement(it) } +
                        getAgents(folder.id).map { buildAgentTreeElement(it) }
                    .toList()
            }
        return treeElement
    }

    private fun buildAgentTreeElement(agent: Agent): BackupDTO.TreeElement.Agent {
        val treeElement = agent.toTreeElement()
            .apply {
                children = agent.getApplications()
                    .map { buildApplicationTreeElement(it) }
                    .toList()
            }
        return treeElement
    }

    private fun buildApplicationTreeElement(application: Application): BackupDTO.TreeElement.Application {
        val treeElement = application.toTreeElement()
            .apply {
                children = application.getInstances()
                    .map { buildInstanceTreeElement(it) }
                    .toList()
                metricRules = applicationMetricRuleKrud.searchByFilter {
                    where {
                        ApplicationMetricRule::applicationId Equal application.id
                    }
                }
                    .map {
                        it.toTreeElement()
                    }
            }
        return treeElement
    }

    private fun buildInstanceTreeElement(instance: Instance): BackupDTO.TreeElement.Application.Instance {
        return instance.toTreeElement()
    }

    private fun getFolders(parentFolderId: UUID? = null) = folderKrud.searchSequence {
        if (parentFolderId == null) {
            Folder::parentFolderId.isNull()
        } else {
            Folder::parentFolderId Equal parentFolderId
        }
    }

    private fun getAgents(parentFolderId: UUID? = null) = agentKrud.searchSequence {
        if (parentFolderId == null) {
            Agent::parentFolderId.isNull()
        } else {
            Agent::parentFolderId Equal parentFolderId
        }
    }

    private fun getApplications(parentFolderId: UUID? = null, parentAgentId: UUID? = null) = applicationKrud.searchSequence {
        if (parentFolderId == null) {
            Application::parentFolderId.isNull()
        } else {
            Application::parentFolderId Equal parentFolderId
        }
        if (parentAgentId == null) {
            Application::parentAgentId.isNull()
        } else {
            Application::parentAgentId Equal parentAgentId
        }
        Application::demo Equal false
    }

    private fun Application.getInstances(): Sequence<Instance> = instanceKrud.searchSequence {
        Instance::parentApplicationId Equal id
        Instance::discovered Equal false
    }

    private fun Agent.getApplications(): Sequence<Application> = applicationKrud.searchSequence {
        Application::parentAgentId Equal id
    }
}