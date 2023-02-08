/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-02-08 14:15:52.

export interface ApplicationModifyRequestRO {
    alias: string;
    type: ApplicationType;
    description?: string;
    color?: string;
    icon?: string;
    sort?: number;
    parentFolderId?: string;
}

export interface ApplicationRO {
    id: string;
    alias: string;
    type: ApplicationType;
    instanceCount: number;
    description?: string;
    color?: string;
    effectiveColor?: string;
    icon?: string;
    sort?: number;
    parentFolderId?: string;
}

export interface FolderModifyRequestRO {
    alias: string;
    description?: string;
    color?: string;
    icon?: string;
    sort?: number;
    parentFolderId?: string;
}

export interface FolderRO {
    id: string;
    alias: string;
    description?: string;
    color?: string;
    effectiveColor?: string;
    icon?: string;
    sort?: number;
    parentFolderId?: string;
}

export interface InstanceModifyRequestRO {
    alias: string;
    actuatorUrl: string;
    dataCollectionIntervalSeconds: number;
    description?: string;
    color?: string;
    icon?: string;
    sort?: number;
    parentApplicationId?: string;
}

export interface InstanceRO {
    id: string;
    alias: string;
    actuatorUrl: string;
    dataCollectionIntervalSeconds: number;
    description?: string;
    color?: string;
    effectiveColor?: string;
    icon?: string;
    sort?: number;
    parentApplicationId?: string;
    endpoints: string[];
    abilities: InstanceAbility[];
}

export type ApplicationType = "SPRING_BOOT";

export type InstanceAbility = "METRICS" | "ENV" | "BEANS" | "QUARTZ" | "FLYWAY" | "LIQUIBASE" | "LOGGERS" | "CACHES" | "THREADDUMP" | "HEAPDUMP" | "CACHE_STATISTICS" | "SHUTDOWN" | "REFRESH" | "HTTP_REQUEST_STATISTICS" | "INTEGRATIONGRAPH" | "PROPERTIES" | "MAPPINGS" | "SCHEDULEDTASKS" | "HEALTH" | "INFO";
