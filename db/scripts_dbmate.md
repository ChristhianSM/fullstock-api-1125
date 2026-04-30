"db:new": "dbmate new", -> genera un archivo de migracion
"db:up": "dbmate up", -> actualiza o crea la bd y aplica las migraciones pendientes
"db:migrate": "dbmate migrate", -> sincronizar una migracion pendiente
"db:rollback": "dbmate rollback",-> restablece a la ultima migracion estable 
"db:status": "dbmate status", -> averigua el estado de migraciones pendientes aplicadas|pendientes
"db:drop": "dbmate drop", -> elimina la base de datos 
"db:reset": "npm run db:drop && npm run db:up" -> limpia la bd  y luego corre las migraciones de 0 1 x 1

