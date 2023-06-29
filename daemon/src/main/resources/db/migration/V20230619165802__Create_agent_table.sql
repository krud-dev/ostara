create table agent
(
    id               blob         not null,
    creation_time    timestamp    not null,
    last_update_time timestamp    not null,
    version          bigint       not null,
    name             varchar(255) not null,
    url              varchar(255) not null,
    api_key          varchar(255),
    color            varchar(30) default 'inherited' not null,
    icon             varchar(255),
    sort             float,
    parent_folder_id blob references folder (id),
    authentication   json,
    primary key (id)
);