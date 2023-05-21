create table application_metric_rule
(
    id               blob                 not null primary key,
    creation_time    timestamp            not null,
    last_update_time timestamp            not null,
    version          bigint               not null,
    application_id   blob                 not null references application (id),
    metric_name      TEXT                 not null,
    operation        varchar(255)         not null,
    value1           float                not null,
    value2           float,
    enabled          boolean default true not null
);
