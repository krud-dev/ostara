create table folder
(
    id               blob                            not null
        primary key,
    creation_time    timestamp                       not null,
    last_update_time timestamp                       not null,
    version          bigint                          not null,
    alias            varchar(255)                    not null,
    authentication   json,
    color            varchar(30) default 'inherited' not null,
    description      varchar(255),
    icon             varchar(255),
    parent_folder_id blob references folder (id),
    sort             float
);