﻿CREATE TABLE [dbo].[HScore](
	[ScoreId] INT NOT NULL PRIMARY KEY,
	[LevelScore] INT NOT NULL,
	[LevelNr] INT NOT NULL
	CONSTRAINT [FK_Hscore_Score] FOREIGN KEY REFERENCES System_Users(Id)
	);