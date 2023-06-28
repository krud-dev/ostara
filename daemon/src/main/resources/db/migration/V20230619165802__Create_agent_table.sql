create table agent
(
    id               blob         not null,
    creation_time    timestamp    not null,
    last_update_time timestamp    not null,
    version          bigint       not null,
    name             varchar(255) not null,
    url              varchar(255) not null,
    api_key          varchar(255),
    primary key (id)
);