#!/usr/bin/env bash
mysql -uroot -pkwdikosmysql < empty.sql
nodemon server.js
