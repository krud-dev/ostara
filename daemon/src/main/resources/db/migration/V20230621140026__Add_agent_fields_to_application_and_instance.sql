
alter table application add column parent_agent_id blob references agent (id);
alter table application add column agent_external_id varchar(1024);
alter table instance add column parent_agent_id blob references agent (id);
alter table instance add column agent_external_id varchar(1024)
