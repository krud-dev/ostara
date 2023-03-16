/* tslint:disable */
/* eslint-disable */

export interface DynamicModelFilter {
    start?: number;
    limit?: number;
    orders: OrderDTO[];
    filterFields: FilterField[];
    cacheKey: string;
}

export interface PagedResult<T> extends Iterable<T>, KMappedMarker {
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
    _links: { [index: string]: EndpointsActuatorResponse$Link };
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
    components?: { [index: string]: HealthActuatorResponse$Component };
    groups?: string[];
    details?: { [index: string]: any };
}

export interface InfoActuatorResponse {
    build?: InfoActuatorResponse$Build;
    git?: InfoActuatorResponse$Git;
}

export interface IntegrationGraphActuatorResponse {
    contentDescriptor: IntegrationGraphActuatorResponse$ContentDescriptor;
    nodes: IntegrationGraphActuatorResponse$Node[];
    links: IntegrationGraphActuatorResponse$Link[];
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
    groups: { [index: string]: LoggersActuatorResponse$Group };
}

export interface MappingsActuatorResponse {
    contexts: { [index: string]: MappingsActuatorResponse$Context };
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

export interface QuartzActuatorResponse {
    jobs: QuartzActuatorResponse$JobsOrTriggers;
    triggers: QuartzActuatorResponse$JobsOrTriggers;
}

export interface QuartzJobResponse {
    group: string;
    name: string;
    description: string;
    className: string;
    durable: boolean;
    requestRecovery: boolean;
    data: { [index: string]: any };
    triggers: QuartzJobResponse$Trigger[];
}

export interface QuartzJobsByGroupResponse {
    group: string;
    jobs: { [index: string]: QuartzJobsByGroupResponse$Job };
}

export interface QuartzJobsResponse {
    groups: { [index: string]: QuartzJobsResponse$Group };
}

export interface QuartzTriggerResponse {
    group: string;
    name: string;
    description: string;
    state: QuartzTriggerResponse$State;
    type: QuartzTriggerResponse$Type;
    calendarName?: string;
    startTime?: ParsedDate;
    endTime?: ParsedDate;
    previousFireTime?: ParsedDate;
    nextFireTime?: ParsedDate;
    priority: number;
    finalFireTime?: ParsedDate;
    data?: { [index: string]: any };
    calendarInterval?: QuartzTriggerResponse$CalendarInterval;
    custom?: QuartzTriggerResponse$Custom;
    cron?: QuartzTriggerResponse$Cron;
    dailyTimeInterval?: QuartzTriggerResponse$DailyTimeInterval;
    simple?: QuartzTriggerResponse$Simple;
}

export interface QuartzTriggersByGroupResponse {
    group: string;
    paused: boolean;
    triggers: QuartzTriggersByGroupResponse$Triggers;
}

export interface QuartzTriggersResponse {
    groups: { [index: string]: QuartzTriggersResponse$Group };
}

export interface ScheduledTasksActuatorResponse {
    cron: ScheduledTasksActuatorResponse$Cron[];
    fixedDelay: ScheduledTasksActuatorResponse$FixedDelayOrRate[];
    fixedRate: ScheduledTasksActuatorResponse$FixedDelayOrRate[];
    custom: ScheduledTasksActuatorResponse$Custom[];
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

export interface EvictApplicationCachesResultRO {
    summaries: { [index: string]: ResultAggregationSummary<Unit> };
    status: ResultAggregationSummary$Status;
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
    authentication: Authentication;
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
    authentication: Authentication;
    effectiveAuthentication: EffectiveAuthentication;
}

export interface FolderModifyRequestRO {
    alias: string;
    color: string;
    authentication: Authentication;
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
    authentication: Authentication;
    effectiveAuthentication: EffectiveAuthentication;
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

export interface InstanceDisplayNameRO {
    displayName: string;
}

export interface InstanceHealthRO {
    status: InstanceHealthStatus;
    statusText?: string;
    lastUpdateTime: DateAsNumber;
    lastStatusChangeTime: DateAsNumber;
}

export interface InstanceHeapdumpReferenceRO {
    id: string;
    instanceId: string;
    creationTime: DateAsNumber;
    status: InstanceHeapdumpReference$Status;
    path?: string;
    size?: number;
    error?: string;
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
    redactionLevel: InstancePropertyRO$RedactionLevel;
}

export interface InstanceModifyRequestRO {
    alias?: string;
    actuatorUrl: string;
    parentApplicationId: string;
    color: string;
    description?: string;
    icon?: string;
    sort?: number;
}

export interface InstanceRO {
    id: string;
    displayName: string;
    hostname?: string;
    alias?: string;
    actuatorUrl: string;
    parentApplicationId: string;
    description?: string;
    color: string;
    effectiveColor: string;
    icon?: string;
    sort?: number;
    health: InstanceHealthRO;
    effectiveAuthentication: EffectiveAuthentication;
}

export interface InstanceSystemEnvironmentRO {
    properties: { [index: string]: string };
    redactionLevel: InstanceSystemEnvironmentRO$RedactionLevel;
}

export interface InstanceSystemPropertiesRO {
    properties: { [index: string]: string };
    redactionLevel: InstanceSystemPropertiesRO$RedactionLevel;
}

export interface EventLogRO {
    id: string;
    creationTime: DateAsNumber;
    type: EventLogType;
    severity: EventLogSeverity;
    targetId: string;
    message?: string;
}

export interface ThreadProfilingLogRO {
    id: string;
    creationTime: DateAsNumber;
    requestId: string;
    threads: ThreadDumpActuatorResponse$Thread[];
}

export interface ThreadProfilingRequestCreateRO {
    instanceId: string;
    durationSec: number;
}

export interface ThreadProfilingRequestRO {
    id: string;
    creationTime: DateAsNumber;
    instanceId: string;
    durationSec: number;
    finishTime: DateAsNumber;
    status: ThreadProfilingStatus;
}

export interface ApplicationHealthUpdatedEventMessage$Payload {
    applicationId: string;
    newStatus: ApplicationHealthStatus;
}

export interface InstanceHealthChangedEventMessage$Payload {
    parentApplicationId: string;
    instanceId: string;
    oldStatus: InstanceHealthStatus;
    newStatus: InstanceHealthStatus;
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
}

export interface KMappedMarker {
}

export interface BeansActuatorResponse$Context {
    beans: { [index: string]: BeansActuatorResponse$Context$Bean };
    parentId?: string;
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
    property?: EnvPropertyActuatorResponse$PropertySource$Property;
}

export interface FlywayActuatorResponse$Context {
    flywayBeans: { [index: string]: FlywayActuatorResponse$Context$FlywayBean };
    parentId?: string;
}

export interface HealthActuatorResponse$Component {
    status: HealthActuatorResponse$Status;
    description?: string;
    components?: { [index: string]: HealthActuatorResponse$Component };
    details?: { [index: string]: any };
}

export interface InfoActuatorResponse$Build {
    artifact: string;
    group: string;
    name: string;
    version: string;
    time?: ParsedDate;
}

export interface InfoActuatorResponse$Git {
    branch: string;
    commit: InfoActuatorResponse$Git$Commit;
}

export interface IntegrationGraphActuatorResponse$ContentDescriptor {
    providerVersion: string;
    providerFormatVersion: number;
    provider: string;
    name?: string;
}

export interface IntegrationGraphActuatorResponse$Node {
    nodeId: number;
    componentType: string;
    integrationPatternType: string;
    integrationPatternCategory: string;
    properties: { [index: string]: string };
    sendTimers?: { [index: string]: IntegrationGraphActuatorResponse$Node$SendTimer };
    receiveCounters?: { [index: string]: number };
    name: string;
    input?: string;
    output?: string;
    errors?: string;
    discards?: string;
    routes?: string[];
}

export interface IntegrationGraphActuatorResponse$Link {
    from: number;
    to: number;
    type: IntegrationGraphActuatorResponse$Link$Type;
}

export interface LiquibaseActuatorResponse$Context {
    liquibaseBeans: { [index: string]: LiquibaseActuatorResponse$Context$LiquibaseBean };
    parentId?: string;
}

export interface LoggersActuatorResponse$Logger {
    effectiveLevel: LogLevel;
    configuredLevel?: LogLevel;
}

export interface LoggersActuatorResponse$Group {
    configuredLevel?: LogLevel;
    members: string[];
}

export interface MappingsActuatorResponse$Context {
    mappings: MappingsActuatorResponse$Context$Mappings;
    parentId?: string;
}

export interface MetricActuatorResponse$Tag {
    tag: string;
    values: string[];
}

export interface MetricActuatorResponse$Measurement {
    statistic: string;
    value: number;
}

export interface QuartzActuatorResponse$JobsOrTriggers {
    groups: string[];
}

export interface QuartzJobResponse$Trigger {
    group: string;
    name: string;
    previousFireTime?: ParsedDate;
    nextFireTime?: ParsedDate;
    priority: number;
}

export interface QuartzJobsByGroupResponse$Job {
    className: string;
}

export interface QuartzJobsResponse$Group {
    jobs: string[];
}

export interface ParsedDate {
    date?: DateAsNumber;
    original?: string;
}

export interface QuartzTriggerResponse$CalendarInterval {
    interval: number;
    timeZone: string;
    timesTriggered: number;
    preserveHourOfDayAcrossDaylightSavings: boolean;
    skipDayIfHourDoesNotExist: boolean;
}

export interface QuartzTriggerResponse$Custom {
    trigger: string;
}

export interface QuartzTriggerResponse$Cron {
    expression: string;
    timeZone: string;
}

export interface QuartzTriggerResponse$DailyTimeInterval {
    interval: number;
    daysOfWeek: number[];
    startTimeOfDay: string;
    endTimeOfDay: string;
    repeatCount: number;
    timesTriggered: number;
}

export interface QuartzTriggerResponse$Simple {
    interval: number;
    repeatCount: number;
    timesTriggered: number;
}

export interface QuartzTriggersByGroupResponse$Triggers {
    cron: { [index: string]: QuartzTriggersByGroupResponse$Cron };
    simple: { [index: string]: QuartzTriggersByGroupResponse$Simple };
    dailyTimeInterval: { [index: string]: QuartzTriggersByGroupResponse$DailyTimeInterval };
    calendarInterval: { [index: string]: QuartzTriggersByGroupResponse$CalendarInterval };
    custom: { [index: string]: QuartzTriggersByGroupResponse$Custom };
}

export interface QuartzTriggersResponse$Group {
    paused: boolean;
    triggers: string[];
}

export interface ScheduledTasksActuatorResponse$Cron {
    runnable: ScheduledTasksActuatorResponse$Runnable;
    expression: string;
}

export interface ScheduledTasksActuatorResponse$FixedDelayOrRate {
    runnable: ScheduledTasksActuatorResponse$Runnable;
    initialDelay: number;
    interval: number;
}

export interface ScheduledTasksActuatorResponse$Custom {
    runnable: ScheduledTasksActuatorResponse$Runnable;
    trigger: string;
}

export interface ThreadDumpActuatorResponse$Thread {
    threadName: string;
    threadId: number;
    blockedTime: number;
    blockedCount: number;
    waitedTime: number;
    waitedCount: number;
    lockName?: string;
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
    lockInfo?: ThreadDumpActuatorResponse$Thread$LockInfo;
}

export interface Unit {
}

export interface Authentication {
}

export interface EffectiveAuthentication {
    authentication: Authentication;
    sourceType: EffectiveAuthentication$SourceType;
    sourceId: string;
}

export interface Iterable<T> {
}

export interface BeansActuatorResponse$Context$Bean {
    aliases: string[];
    scope: string;
    type: string;
    resource?: string;
    dependencies: string[];
}

export interface CachesActuatorResponse$CacheManager$Cache {
    target: string;
}

export interface ConfigPropsActuatorResponse$Context$Bean {
    prefix?: string;
    properties?: { [index: string]: any };
    inputs?: { [index: string]: any };
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
    time?: ParsedDate;
}

export interface IntegrationGraphActuatorResponse$Node$SendTimer {
    count: number;
    mean: number;
    max: number;
}

export interface LiquibaseActuatorResponse$Context$LiquibaseBean {
    changeSets: LiquibaseActuatorResponse$Context$LiquibaseBean$ChangeSet[];
}

export interface MappingsActuatorResponse$Context$Mappings {
    dispatcherServlets: { [index: string]: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler[] };
    servletFilters: MappingsActuatorResponse$Context$Mappings$ServletFilter[];
    servlets: MappingsActuatorResponse$Context$Mappings$Servlet[];
    dispatcherHandlers?: { [index: string]: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler[] };
}

export interface QuartzTriggersByGroupResponse$Cron {
    previousFireTime?: ParsedDate;
    nextFireTime?: ParsedDate;
    priority: number;
    expression: string;
    timeZone: string;
}

export interface QuartzTriggersByGroupResponse$Simple {
    previousFireTime?: ParsedDate;
    nextFireTime?: ParsedDate;
    priority: number;
    interval: number;
}

export interface QuartzTriggersByGroupResponse$DailyTimeInterval {
    previousFireTime?: ParsedDate;
    nextFireTime?: ParsedDate;
    priority: number;
    interval: number;
    daysOfWeek: string[];
    startTimeOfDay: string;
    endTimeOfDay: string;
}

export interface QuartzTriggersByGroupResponse$CalendarInterval {
    previousFireTime?: ParsedDate;
    nextFireTime?: ParsedDate;
    priority: number;
    interval: number;
    timeZone: string;
}

export interface QuartzTriggersByGroupResponse$Custom {
    previousFireTime?: ParsedDate;
    nextFireTime?: ParsedDate;
    priority: number;
    trigger: string;
}

export interface ScheduledTasksActuatorResponse$Runnable {
    target: string;
}

export interface ThreadDumpActuatorResponse$Thread$StackTraceFrame {
    classLoaderName?: string;
    moduleName?: string;
    moduleVersion?: string;
    fileName?: string;
    className?: string;
    methodName?: string;
    lineNumber: number;
    nativeMethod: boolean;
}

export interface ThreadDumpActuatorResponse$Thread$LockedMonitor {
    className?: string;
    identityHashCode: number;
    lockedStackDepth: number;
    lockedStackFrame: ThreadDumpActuatorResponse$Thread$StackTraceFrame;
}

export interface ThreadDumpActuatorResponse$Thread$LockedSynchronizer {
    className?: string;
    identityHashCode: number;
}

export interface ThreadDumpActuatorResponse$Thread$LockInfo {
    className?: string;
    identityHashCode: number;
}

export interface Authentication$None extends Authentication {
    type: string;
}

export interface Authentication$Inherit extends Authentication {
    type: string;
}

export interface Authentication$Basic extends Authentication {
    username: string;
    password: string;
    type: string;
}

export interface Authentication$Header extends Authentication {
    headerName: string;
    headerValue: string;
    type: string;
}

export interface Authentication$QueryString extends Authentication {
    key: string;
    value: string;
    type: string;
}

export interface Authentication$BearerToken extends Authentication {
    token: string;
    type: string;
}

export interface FlywayActuatorResponse$Context$FlywayBean$Migration {
    type: string;
    checksum: number;
    version?: string;
    description: string;
    script: string;
    state: string;
    installedBy: string;
    installedOn: ParsedDate;
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
    contexts: string[];
    dateExecuted: ParsedDate;
    deploymentId: string;
    description: string;
    execType: string;
    labels: string[];
    tag?: string;
}

export interface MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler {
    handler: string;
    predicate: string;
    details?: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details;
}

export interface MappingsActuatorResponse$Context$Mappings$ServletFilter {
    servletNameMappings: string[];
    urlPatternMappings: string[];
    name: string;
    className: string;
}

export interface MappingsActuatorResponse$Context$Mappings$Servlet {
    mappings: string[];
    name: string;
    className: string;
}

export interface MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details {
    handlerMethod?: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$HandlerMethod;
    handlerFunction?: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$HandlerFunction;
    requestMappingConditions?: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$RequestMappingConditions;
}

export interface MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$HandlerMethod {
    className: string;
    name: string;
    descriptor: string;
}

export interface MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$HandlerFunction {
    className: string;
}

export interface MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$RequestMappingConditions {
    consumes: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$RequestMappingConditions$MediaType[];
    headers: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$RequestMappingConditions$Header[];
    methods: string[];
    params: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$RequestMappingConditions$Param[];
    patterns: string[];
    produces: MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$RequestMappingConditions$MediaType[];
}

export interface MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$RequestMappingConditions$MediaType {
    mediaType: string;
    negated: boolean;
}

export interface MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$RequestMappingConditions$Header {
    name: string;
    value: string;
}

export interface MappingsActuatorResponse$Context$Mappings$DispatcherServletOrHandler$Details$RequestMappingConditions$Param {
    name: string;
    value: string;
}

export type DateAsNumber = number;

export type InstanceAbility = "METRICS" | "ENV" | "BEANS" | "QUARTZ" | "FLYWAY" | "LIQUIBASE" | "LOGGERS" | "CACHES" | "THREADDUMP" | "HEAPDUMP" | "CACHE_STATISTICS" | "SHUTDOWN" | "REFRESH" | "HTTP_REQUEST_STATISTICS" | "INTEGRATIONGRAPH" | "PROPERTIES" | "MAPPINGS" | "SCHEDULEDTASKS" | "HEALTH" | "INFO" | "SYSTEM_PROPERTIES" | "SYSTEM_ENVIRONMENT";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | "TRACE";

export type HealthActuatorResponse$Status = "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN";

export type LogLevel = "TRACE" | "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL" | "OFF";

export type QuartzTriggerResponse$State = "NONE" | "NORMAL" | "PAUSED" | "COMPLETE" | "ERROR" | "BLOCKED";

export type QuartzTriggerResponse$Type = "calendarInterval" | "cron" | "custom" | "dailyTimeInterval" | "simple";

export type ResultAggregationSummary$Status = "SUCCESS" | "PARTIAL_SUCCESS" | "FAILURE";

export type ApplicationHealthStatus = "ALL_UP" | "ALL_DOWN" | "SOME_DOWN" | "UNKNOWN" | "PENDING";

export type ApplicationType = "SPRING_BOOT";

export type InstanceHealthStatus = "UP" | "DOWN" | "UNKNOWN" | "OUT_OF_SERVICE" | "UNREACHABLE" | "PENDING" | "INVALID";

export type InstanceHeapdumpReference$Status = "PENDING_DOWNLOAD" | "DOWNLOADING" | "READY" | "FAILED";

export type InstancePropertyRO$RedactionLevel = "NONE" | "PARTIAL" | "FULL";

export type InstanceSystemEnvironmentRO$RedactionLevel = "NONE" | "PARTIAL" | "FULL";

export type InstanceSystemPropertiesRO$RedactionLevel = "NONE" | "PARTIAL" | "FULL";

export type EventLogType = "INSTANCE_HEALTH_CHANGED";

export type EventLogSeverity = "INFO" | "WARN" | "ERROR";

export type ThreadProfilingStatus = "RUNNING" | "FINISHED";

export type FilterFieldOperation = "Equal" | "NotEqual" | "In" | "NotIn" | "GreaterThan" | "GreaterEqual" | "LowerThan" | "LowerEqual" | "Between" | "Contains" | "IsNull" | "IsNotNull" | "IsEmpty" | "IsNotEmpty" | "And" | "Or" | "Not" | "Noop";

export type FilterFieldDataType = "String" | "Integer" | "Long" | "Double" | "Boolean" | "Date" | "Object" | "Enum" | "UUID" | "None";

export type IntegrationGraphActuatorResponse$Link$Type = "input" | "output";

export type EffectiveAuthentication$SourceType = "FOLDER" | "APPLICATION";
