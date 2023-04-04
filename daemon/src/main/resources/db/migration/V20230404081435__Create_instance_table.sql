create table instance
(
    id                    blob                            not null
        primary key,
    creation_time         timestamp                       not null,
    last_update_time      timestamp                       not null,
    version               bigint                          not null,
    actuator_url          varchar(255)                    not null,
    alias                 varchar(255),
    color                 varchar(30) default 'inherited' not null,
    description           varchar(255),
    icon                  varchar(255),
    parent_application_id blob                            not null references application (id),
    sort                  float
);