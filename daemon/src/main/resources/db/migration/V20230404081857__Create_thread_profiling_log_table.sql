create table thread_profiling_log
(
    id               blob      not null
        primary key,
    creation_time    timestamp not null,
    last_update_time timestamp not null,
    version          bigint    not null,
    request_id       blob      not null references thread_profiling_request (id),
    threads          json
);