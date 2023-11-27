#!/bin/bash

function log_message {
    message=$1
    echo "$timestamp - $message"
}

timestamp=$(date +"%Y-%m-%d_%H")


db_user=raphauy
db_pass=
db_host=ep-silent-paper-27806001.us-east-1.aws.neon.tech
db_port=5432
db_name=neondb
db_conn_string=postgresql://$db_user:$db_pass@$db_host:$db_port/$db_name

log_message "Eliminando tablas existentes en la base de datos $db_name de $db_host..."

function drop_all_tables {
    psql $1 -c "
    DO \$$ 
    DECLARE 
        table_name text; 
    BEGIN 
        FOR table_name IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
        LOOP 
            EXECUTE 'DROP TABLE IF EXISTS \"' ||  table_name || '\" CASCADE'; 
        END LOOP; 
    END \$$;
    "
}

drop_all_tables $db_conn_string

log_message "Todas las tablas eliminadas."
