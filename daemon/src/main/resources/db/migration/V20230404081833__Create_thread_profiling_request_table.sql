create table thread_profiling_request
(
    id               blob                          not null
        primary key,
    creation_time    timestamp                     not null,
    last_update_time timestamp                     not null,
    version          bigint                        not null,
    duration_sec     integer,
    finish_time      timestamp,
    instance_id      blob                          not null references instance (id),
    status           varchar(15) default 'RUNNING' not null
);