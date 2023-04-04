create table event_log
(
    id               blob                       not null
        primary key,
    creation_time    timestamp                  not null,
    last_update_time timestamp                  not null,
    version          bigint                     not null,
    message          varchar(255),
    severity         varchar(10) default 'INFO' not null,
    target_id        blob                       not null,
    type             varchar(255)               not null
);