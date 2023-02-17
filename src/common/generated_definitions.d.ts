/* tslint:disable */
/* eslint-disable */

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

export interface BeansActuatorResponse {
    contexts: { [index: string]: BeansActuatorResponse$Context };
}

export interface CacheActuatorResponse {
    target: string;
    name: string;
    cacheManager: string;
}

export interface CachesActuatorResponse {
    cacheManagers: { [index: string]: CachesActuatorResponse$CacheManager };
}

export interface ConfigPropsActuatorResponse {
    contexts: { [index: string]: ConfigPropsActuatorResponse$Context };
}

export interface EndpointsActuatorResponse {
    links: { [index: string]: EndpointsActuatorResponse$Link };
}

export interface EnvActuatorResponse {
    activeProfiles: string[];
    propertySources: EnvActuatorResponse$PropertySource[];
}

export interface EnvPropertyActuatorResponse {
    property: EnvPropertyActuatorResponse$Property;
    activeProfiles: string[];
    propertySources: EnvPropertyActuatorResponse$PropertySource[];
}

export interface FlywayActuatorResponse {
    contexts: { [index: string]: FlywayActuatorResponse$Context };
}

export interface HealthActuatorResponse {
    status: HealthActuatorResponse$Status;
    components: { [index: string]: HealthActuatorResponse$Component };
    groups?: string[];
}

export interface InfoActuatorResponse {
    build?: InfoActuatorResponse$Build;
    git?: InfoActuatorResponse$Git;
}

export interface LiquibaseActuatorResponse {
    contexts: { [index: string]: LiquibaseActuatorResponse$Context };
}

export interface LoggerActuatorResponse {
    effectiveLevel?: LogLevel;
    configuredLevel?: LogLevel;
    members?: string[];
}

export interface LoggerUpdateRequest {
    configuredLevel?: LogLevel;
}

export interface LoggersActuatorResponse {
    levels: LogLevel[];
    loggers: { [index: string]: LoggersActuatorResponse$Logger };
}

export interface MetricActuatorResponse {
    name: string;
    description?: string;
    baseUnit?: string;
    availableTags: MetricActuatorResponse$Tag[];
    measurements: MetricActuatorResponse$Measurement[];
}

export interface MetricsActuatorResponse {
    names: string[];
}

export interface TestConnectionResponse {
    statusCode: number;
    statusText?: string;
    validActuator: boolean;
    success: boolean;
}

export interface ThreadDumpActuatorResponse {
    threads: ThreadDumpActuatorResponse$Thread[];
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
    color: string;
    description?: string;
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
    color: string;
    effectiveColor: string;
    icon?: string;
    sort?: number;
    parentFolderId?: string;
    health: ApplicationHealthRO;
}

export interface FolderModifyRequestRO {
    alias: string;
    color: string;
    description?: string;
    icon?: string;
    sort?: number;
    parentFolderId?: string;
}

export interface FolderRO {
    id: string;
    alias: string;
    description?: string;
    color: string;
    effectiveColor: string;
    icon?: string;
    sort?: number;
    parentFolderId?: string;
}

export interface EvictCachesRequestRO {
    cacheNames: string[];
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

export interface InstanceHealthLogRO {
    creationTime: DateAsNumber;
    instanceId: string;
    status: InstanceHealthStatus;
    statusText?: string;
}

export interface InstanceHealthRO {
    status: InstanceHealthStatus;
    statusText?: string;
    lastUpdateTime: DateAsNumber;
    lastStatusChangeTime: DateAsNumber;
}

export interface InstanceHttpRequestStatisticsRO {
    uri: string;
    count: number;
    totalTime: number;
    max: number;
}

export interface InstanceLoggerRO {
    name: string;
    effectiveLevel?: LogLevel;
    configuredLevel?: LogLevel;
}

export interface InstanceMetricRO {
    name: string;
    description?: string;
    unit?: string;
    values: InstanceMetricValueRO[];
}

export interface InstanceMetricValueRO {
    value: number;
    timestamp: DateAsNumber;
}

export interface InstancePropertyRO {
    contexts: { [index: string]: { [index: string]: any } };
}

export interface InstanceModifyRequestRO {
    alias: string;
    actuatorUrl: string;
    dataCollectionIntervalSeconds: number;
    color: string;
    description?: string;
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
    color: string;
    effectiveColor: string;
    icon?: string;
    sort?: number;
    parentApplicationId?: string;
    abilities: InstanceAbility[];
    health: InstanceHealthRO;
}

export interface EventLogRO {
    id: string;
    creationTime: DateAsNumber;
    type: EventLogType;
    severity: EventLogSeverity;
    targetId: string;
    message?: string;
}

export interface ResultAggregationSummary<T> {
    totalCount: number;
    successCount: number;
    failureCount: number;
    errors: (string | undefined)[];
    status: ResultAggregationSummary$Status;
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

export interface BeansActuatorResponse$Context {
    beans: { [index: string]: BeansActuatorResponse$Context$Bean };
}

export interface CachesActuatorResponse$CacheManager {
    caches: { [index: string]: CachesActuatorResponse$CacheManager$Cache };
}

export interface ConfigPropsActuatorResponse$Context {
    beans: { [index: string]: ConfigPropsActuatorResponse$Context$Bean };
    parentId?: string;
}

export interface EndpointsActuatorResponse$Link {
    href: string;
    templated: boolean;
}

export interface EnvActuatorResponse$PropertySource {
    name: string;
    properties?: { [index: string]: EnvActuatorResponse$PropertySource$Property };
}

export interface EnvPropertyActuatorResponse$Property {
    value: string;
    source: string;
}

export interface EnvPropertyActuatorResponse$PropertySource {
    name: string;
    properties?: { [index: string]: EnvPropertyActuatorResponse$PropertySource$Property };
}

export interface FlywayActuatorResponse$Context {
    flywayBeans: { [index: string]: FlywayActuatorResponse$Context$FlywayBean };
}

export interface HealthActuatorResponse$Component {
    status: HealthActuatorResponse$Status;
    description?: string;
    components?: { [index: string]: HealthActuatorResponse$Component };
    details: { [index: string]: any };
}

export interface InfoActuatorResponse$Build {
    artifact: string;
    group: string;
    name: string;
    version: string;
}

export interface InfoActuatorResponse$Git {
    branch: string;
    commit: InfoActuatorResponse$Git$Commit;
}

export interface LiquibaseActuatorResponse$Context {
    liquibaseBeans: { [index: string]: LiquibaseActuatorResponse$Context$LiquibaseBean };
}

export interface LoggersActuatorResponse$Logger {
    effectiveLevel: LogLevel;
    configuredLevel?: LogLevel;
}

export interface MetricActuatorResponse$Tag {
    tag: string;
    values: string[];
}

export interface MetricActuatorResponse$Measurement {
    statistic: string;
    value: number;
}

export interface ThreadDumpActuatorResponse$Thread {
    threadName: string;
    threadId: number;
    blockedTime: number;
    blockedCount: number;
    waitedTime: number;
    waitedCount: number;
    lockName: string;
    lockOwnerId: number;
    lockOwnerName?: string;
    daemon: boolean;
    inNative: boolean;
    suspended: boolean;
    threadState: string;
    priority: number;
    stackTrace: ThreadDumpActuatorResponse$Thread$StackTraceFrame[];
    lockedMonitors: ThreadDumpActuatorResponse$Thread$LockedMonitor[];
    lockedSynchronizers: ThreadDumpActuatorResponse$Thread$LockedSynchronizer[];
}

export interface BeansActuatorResponse$Context$Bean {
    aliases: string[];
    scope: string;
    type: string;
    resource: string;
    dependencies: string[];
}

export interface CachesActuatorResponse$CacheManager$Cache {
    target: string;
}

export interface ConfigPropsActuatorResponse$Context$Bean {
    prefix: string;
    properties: { [index: string]: any };
    inputs: { [index: string]: any };
}

export interface EnvActuatorResponse$PropertySource$Property {
    value: string;
    origin?: string;
}

export interface EnvPropertyActuatorResponse$PropertySource$Property {
    value: string;
    origin?: string;
}

export interface FlywayActuatorResponse$Context$FlywayBean {
    migrations: FlywayActuatorResponse$Context$FlywayBean$Migration[];
}

export interface InfoActuatorResponse$Git$Commit {
    id: string;
    time: string;
}

export interface LiquibaseActuatorResponse$Context$LiquibaseBean {
    changeSets: LiquibaseActuatorResponse$Context$LiquibaseBean$ChangeSet[];
}

export interface ThreadDumpActuatorResponse$Thread$StackTraceFrame {
    classLoaderName?: string;
    moduleName: string;
    moduleVersion: string;
    fileName: string;
    className: string;
    methodName: string;
    lineNumber: number;
    nativeMethod: boolean;
}

export interface ThreadDumpActuatorResponse$Thread$LockedMonitor {
    className: string;
    identityHashCode: number;
    lockedStackDepth: number;
    lockedStackFrame: ThreadDumpActuatorResponse$Thread$StackTraceFrame;
}

export interface ThreadDumpActuatorResponse$Thread$LockedSynchronizer {
    className: string;
    identityHashCode: number;
}

export interface FlywayActuatorResponse$Context$FlywayBean$Migration {
    type: string;
    checksum: number;
    version: string;
    description: string;
    script: string;
    state: string;
    installedBy: string;
    installedOn: string;
    installedRank: number;
    executionTime: number;
}

export interface LiquibaseActuatorResponse$Context$LiquibaseBean$ChangeSet {
    id: string;
    checksum: string;
    orderExecuted: number;
    author: string;
    changeLog: string;
    comments: string;
    context: string[];
    dateExecuted: string;
    deploymentId: string;
    description: string;
    execType: string;
    labels: string[];
    tag?: string;
}

export type DateAsNumber = number;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | "TRACE";

export type HealthActuatorResponse$Status = "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";

export type LogLevel = "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL" | "OFF";

export type ApplicationHealthStatus = "ALL_UP" | "ALL_DOWN" | "SOME_DOWN" | "UNKNOWN" | "PENDING";

export type ApplicationType = "SPRING_BOOT";

export type InstanceHealthStatus = "UP" | "DOWN" | "UNKNOWN" | "OUT_OF_SERVICE" | "UNREACHABLE" | "PENDING" | "INVALID";

export type InstanceAbility = "METRICS" | "ENV" | "BEANS" | "QUARTZ" | "FLYWAY" | "LIQUIBASE" | "LOGGERS" | "CACHES" | "THREADDUMP" | "HEAPDUMP" | "CACHE_STATISTICS" | "SHUTDOWN" | "REFRESH" | "HTTP_REQUEST_STATISTICS" | "INTEGRATIONGRAPH" | "PROPERTIES" | "MAPPINGS" | "SCHEDULEDTASKS" | "HEALTH" | "INFO";

export type EventLogType = "INSTANCE_HEALTH_CHANGED";

export type EventLogSeverity = "INFO" | "WARN" | "ERROR";

export type ResultAggregationSummary$Status = "SUCCESS" | "PARTIAL_SUCCESS" | "FAILURE";

export type FilterFieldOperation = "Equal" | "NotEqual" | "In" | "NotIn" | "GreaterThan" | "GreaterEqual" | "LowerThan" | "LowerEqual" | "Between" | "Contains" | "IsNull" | "IsNotNull" | "IsEmpty" | "IsNotEmpty" | "And" | "Or" | "Not" | "Noop";

export type FilterFieldDataType = "String" | "Integer" | "Long" | "Double" | "Boolean" | "Date" | "Object" | "Enum" | "UUID" | "None";
