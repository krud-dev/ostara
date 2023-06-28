
alter table application add column agent_id blob references agent (id);
alter table application add column agent_discovery_params json;
alter table application add column agent_discovery_type varchar(255);
alter table instance add column agent_discovery_id varchar(255);
