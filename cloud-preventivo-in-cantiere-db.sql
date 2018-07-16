CREATE TABLE Cantieri (
    Id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    NomeCliente NVARCHAR(64) NOT NULL,
    EmailCliente NVARCHAR(64) NOT NULL,
    Luogo NVARCHAR(64) NOT NULL
)

CREATE TABLE Interventi (
    Id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    IdCantiere INT NOT NULL REFERENCES Cantieri(Id),
    TipoIntervento NVARCHAR(64) NOT NULL,
    StimaCosto MONEY NOT NULL,
    Note NTEXT
)

CREATE TABLE FotoCantieriInterventi (
    Id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    UrlFoto NVARCHAR(512) NOT NULL,
    IdCantiere INT REFERENCES Cantieri(Id), -- Sarà impostato solo se la foto è relativa ad un cantiere
    IdIntervento INT REFERENCES Interventi(Id) -- Sarà impostato solo se la foto è relativa ad un intervento
)
