/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-02-12 11:30:28.

export interface DynamicModelFilter {
    start?: number;
    limit?: number;
    orders: OrderDTO[];
    filterFields: FilterField[];
    cacheKey: string;
}

export interface PagedResult<T> {
    start?: number;
    limit?: number;
    total: number;
    hasMore: boolean;
    results: T[];
}

export interface CountResultRO {
    total: number;
}

export interface ApplicationCacheRO {
    name: string;
    cacheManager: string;
    target: string;
}

export interface ApplicationCacheStatisticsRO {
    gets: number;
    puts: number;
    evictions: number;
    hits: number;
    misses: number;
    removals: number;
    size: number;
}

export interface ApplicationLoggerRO {
    name: string;
    loggers: { [index: string]: InstanceLoggerRO };
}

export interface ApplicationHealthRO {
    status: ApplicationHealthStatus;
    lastUpdateTime: DateAsNumber;
    lastStatusChangeTime: DateAsNumber;
}

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
    health: ApplicationHealthRO;
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

export interface InstanceCacheRO {
    name: string;
    cacheManager: string;
    target: string;
}

export interface InstanceCacheStatisticsRO {
    gets: number;
    puts: number;
    evictions: number;
    hits: number;
    misses: number;
    removals: number;
    size: number;
}

export interface InstanceLoggerRO {
    name: string;
    effectiveLevel?: LogLevel;
    configuredLevel?: LogLevel;
}

export interface InstanceHealthRO {
    status: InstanceHealthStatus;
    statusText?: string;
    lastUpdateTime: DateAsNumber;
    lastStatusChangeTime: DateAsNumber;
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
    health: InstanceHealthRO;
}

export interface OrderDTO {
    by?: string;
    descending: boolean;
}

export interface FilterField {
    fieldName: string;
    operation: FilterFieldOperation;
    dataType: FilterFieldDataType;
    enumType: string;
    values: any[];
    children: FilterField[];
    validated: boolean;
    value1: any;
    value2: any;
}

export type DateAsNumber = number;

export type ApplicationHealthStatus = "ALL_UP" | "ALL_DOWN" | "SOME_DOWN" | "UNKNOWN" | "PENDING";

export type ApplicationType = "SPRING_BOOT";

export type LogLevel = "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL" | "OFF";

export type InstanceHealthStatus = "UP" | "DOWN" | "UNKNOWN" | "OUT_OF_SERVICE" | "UNREACHABLE" | "PENDING" | "INVALID";

export type InstanceAbility = "METRICS" | "ENV" | "BEANS" | "QUARTZ" | "FLYWAY" | "LIQUIBASE" | "LOGGERS" | "CACHES" | "THREADDUMP" | "HEAPDUMP" | "CACHE_STATISTICS" | "SHUTDOWN" | "REFRESH" | "HTTP_REQUEST_STATISTICS" | "INTEGRATIONGRAPH" | "PROPERTIES" | "MAPPINGS" | "SCHEDULEDTASKS" | "HEALTH" | "INFO";

export type FilterFieldOperation = "Equal" | "NotEqual" | "In" | "NotIn" | "GreaterThan" | "GreaterEqual" | "LowerThan" | "LowerEqual" | "Between" | "Contains" | "IsNull" | "IsNotNull" | "IsEmpty" | "IsNotEmpty" | "And" | "Or" | "Not" | "Noop";

export type FilterFieldDataType = "String" | "Integer" | "Long" | "Double" | "Boolean" | "Date" | "Object" | "Enum" | "UUID" | "None";