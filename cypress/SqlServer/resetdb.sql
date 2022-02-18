/****** Object:  StoredProcedure [VFSTRNS].[ResetDb]    Script Date: 16/02/2022 16:46:31 ******/
/* Este procedimiento se tendría que instalar en las bbdd para resetear los datos */

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [VFSTRNS].[ResetDb] (@Username NVARCHAR(MAX), @ListOfTables NVARCHAR(MAX))
AS
BEGIN
	DECLARE @Table VARCHAR(100)
	DECLARE @ExistsTableBackup BIT = 0
	DECLARE @SQLCreateTableBackup NVARCHAR(500)
	DECLARE @SQLDeleteTable NVARCHAR(500)
	DECLARE @SQLCopyRowsBackupToTable NVARCHAR(500)

	--
	-- Tengo que coger las tablas del listado
	--
	SET @ListOfTables = ' ' + @ListOfTables + ' '

	DECLARE cur CURSOR
	FOR
	SELECT table_name
	FROM INFORMATION_SCHEMA.TABLES
	WHERE table_type = 'BASE TABLE'
		AND TABLE_SCHEMA = 'VFSTRNS'
		AND @ListOfTables LIKE '% ' + TABLE_NAME + ' %'
	ORDER BY table_name

	OPEN cur

	FETCH NEXT
	FROM cur
	INTO @Table

	--
	-- Cogemos cada una de las tablas que nos están pidiendo resetear
	--
	WHILE @@FETCH_STATUS = 0
	BEGIN
		--
		-- Ahora comprobamos si existe una tabla copia de seguridad, si no existe la creamos y pasamos a la siguiente, pero si existe tendremos que resetear la de VFSTRNS
		--
		SELECT @ExistsTableBackup = 1
		FROM INFORMATION_SCHEMA.TABLES
		WHERE table_type = 'BASE TABLE'
			AND TABLE_SCHEMA = 'dbo'
			AND TABLE_NAME = 'VFS_QA_' + @Table

		IF (@ExistsTableBackup = 0) -- Si no exite Backup creamos la tabla para que se utilice en la siguiente ejecución
		BEGIN
			SET @SQLCreateTableBackup = 'SELECT * INTO dbo.VFS_QA_' + @Table + ' FROM VFSTRNS.' + @Table

			EXEC sp_executesql @SQLCreateTableBackup
		END
		ELSE
			-- Si existe backup entonces debemos:
			-- 1. Borrar de las tablas "normales" todos los registros creados o modificados por el usuario de pruebas
			-- 2. Copiar los registros que no existan desde la tabla de backup a la tabla original
		BEGIN
			SET @SQLDeleteTable = 'DELETE FROM VFSTRNS.' + @Table + ' WHERE SYS_CreationUser = '''+@Username+''' or SYS_LastModificationUser = '''+@Username+''''

			EXEC sp_executesql @SQLDeleteTable

			SET @SQLCopyRowsBackupToTable = 'INSERT INTO VFSTRNS.' + @Table + ' SELECT * FROM dbo.VFS_QA_' + @Table + ' EXCEPT SELECT * FROM VFSTRNS.' + @Table

			EXEC sp_executesql @SQLCopyRowsBackupToTable
		END

		--
		-- Consultamos la siguiente tabla
		--
		SET @ExistsTableBackup = 0

		FETCH NEXT
		FROM cur
		INTO @Table
	END

	CLOSE cur

	DEALLOCATE cur
END
GO


