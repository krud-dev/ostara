create table instance_heapdump_reference
(
    id               blob                                   not null
        primary key,
    creation_time    timestamp                              not null,
    last_update_time timestamp                              not null,
    version          bigint                                 not null,
    download_time    timestamp,
    error            text,
    instance_id      blob                                   not null references instance (id),
    path             varchar(255),
    size             bigint,
    status           varchar(30) default 'PENDING_DOWNLOAD' not null
);