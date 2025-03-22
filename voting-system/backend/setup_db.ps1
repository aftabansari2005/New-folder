# Create the database and run the schema
$env:PGPASSWORD = "aftab"
psql -U acer -f src/db/create_db.sql

Write-Host "Database setup completed!" 