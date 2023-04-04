create table instance_hostname
(
    id               blob      not null
        primary key,
    creation_time    timestamp not null,
    last_update_time timestamp not null,
    version          bigint    not null,
    hostname         varchar(255),
    instance_id      blob      not null references instance (id)
);